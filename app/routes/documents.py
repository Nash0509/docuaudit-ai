from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
import shutil
import os
import uuid

from app.services.ingest import ingest_document
from app.core.logger import logger
from app.services.retrieval_service import retrieval_service
from app.core.database import get_db
from app.services.auth_service import get_current_user
from app.models.user import User
from app.models.document import Document
from app.services.activity_service import log_activity
from app.services.notification_service import create_notification
from app.services.email_service import send_email

router = APIRouter()

DOCS_PATH="./docs"
os.makedirs(DOCS_PATH,exist_ok=True)

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF supported"
        )
        
    if current_user.audit_count >= 1 and not current_user.is_subscribed:
        raise HTTPException(
            status_code=402,
            detail="TRIAL_ENDED_UPLOAD"
        )

    document_id = str(uuid.uuid4())

    new_doc = Document(
        id=document_id,
        filename=file.filename,
        user_id=current_user.id,
        status="uploading"
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    file_path = os.path.join(DOCS_PATH, f"{document_id}.pdf")

    with open(file_path,"wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_doc.status = "processing"
    db.commit()

    chunk_count = ingest_document(file_path, document_id)

    new_doc.chunks = chunk_count
    new_doc.status = "ready"
    db.commit()

    # Log Upload Activity
    log_activity(
        db=db,
        user_id=current_user.id,
        action="UPLOAD",
        entity_type="document",
        entity_id=document_id,
        description=f"Uploaded {file.filename}"
    )
    
    # Generate Notifications
    create_notification(
        db=db,
        user_id=current_user.id,
        title="Document Uploaded",
        message=f"Uploaded {file.filename}",
        type="INFO",
        entity_type="document",
        entity_id=document_id
    )

    # Send Email (Pro Subscribers Only)
    if current_user.is_subscribed:
        send_email(
            to_email=current_user.email,
            subject=f"DocuAudit AI: Document Uploaded — {file.filename}",
            title="Document Uploaded",
            message=f"Your document <strong>{file.filename}</strong> has been successfully uploaded and indexed. It is now ready to be audited.",
            type="INFO"
        )

    return {
        "document_id": document_id,
        "filename": file.filename,
        "chunks": chunk_count,
        "status": "ready"
    }

@router.get("/list")
def list_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    documents = db.query(Document).filter(Document.user_id == current_user.id).all()
    
    # Returning in the exact Dictionary format the frontend formerly received from document_registry.list()
    return {
        doc.id: {
            "filename": doc.filename,
            "status": doc.status,
            "uploaded_at": doc.created_at.isoformat() if doc.created_at else None,
            "chunks": doc.chunks,
            "audited": doc.audited,
            "audit_result": doc.audit_result
        } for doc in documents
    }

@router.delete("/{document_id}")
def delete_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        document = db.query(Document).filter(Document.id == document_id).first()

        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
            
        if document.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Forbidden: You can only delete your own documents")

        # remove vectors
        try:
            retrieval_service.delete_document(document_id)
        except Exception:
            pass

        # remove uploaded file
        file_path = f"{DOCS_PATH}/{document_id}.pdf"
        if os.path.exists(file_path):
            os.remove(file_path)

        db.delete(document)
        db.commit()

        # Log Delete Activity
        log_activity(
            db=db,
            user_id=current_user.id,
            action="DOCUMENT_DELETED",
            entity_type="document",
            entity_id=document_id,
            description=f"Deleted document {document.filename}"
        )
        
        # Dispatch Notification
        create_notification(
            db=db,
            user_id=current_user.id,
            title="Document Deleted",
            message=f"Deleted document {document.filename}",
            type="INFO",
            entity_type="document",
            entity_id=document_id
        )

        # Send Email (Pro Subscribers Only)
        if current_user.is_subscribed:
            send_email(
                to_email=current_user.email,
                subject=f"DocuAudit AI: Document Deleted — {document.filename}",
                title="Document Deleted",
                message=f"The document <strong>{document.filename}</strong> and all its associated AI vectors have been permanently deleted from your account.",
                type="INFO"
            )

        logger.info(f"Document fully deleted {document_id}")
        return {"message": "Document deleted"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete failed {document_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Delete failed")
