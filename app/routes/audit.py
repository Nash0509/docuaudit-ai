from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.services.audit_service import audit_service
from app.core.logger import logger
from app.core.database import get_db
from app.services.auth_service import get_current_user
from app.models.user import User
from app.models.document import Document

router = APIRouter()

from pydantic import BaseModel

class AuditRequest(BaseModel):
    rule_ids: list[str] = []

@router.post("/run/{document_id}")
def run_audit(
    document_id: str,
    request: AuditRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        document = db.query(Document).filter(Document.id == document_id).first()

        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
            
        if document.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Forbidden: You can only audit your own documents")

        if document.audit_result:
            logger.info(f"Audit already exists {document_id}")
            return document.audit_result

        result = audit_service.run_audit(document_id, request.rule_ids, db)
        
        document.audited = True
        document.audit_result = result
        db.commit()

        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Audit failed {document_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Audit failed")


@router.get("/result/{document_id}")
def get_audit_result(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        document = db.query(Document).filter(Document.id == document_id).first()

        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
            
        if document.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Forbidden: You can only view your own audit results")

        result = document.audit_result

        if not result:
            raise HTTPException(status_code=404, detail="Audit result not found")

        # Add filename to response to match existing expectations
        result["filename"] = document.filename
        result["uploaded_at"] = document.created_at.isoformat() if document.created_at else None

        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed fetching audit {document_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch audit result")


@router.get("/results")
def get_all_audit_results(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        documents = db.query(Document).filter(Document.user_id == current_user.id).all()
        results = []

        for doc in documents:
            audit = doc.audit_result
            if audit:
                results.append({
                    "document": doc.id,
                    "filename": doc.filename,
                    "uploaded_at": doc.created_at.isoformat() if doc.created_at else None,
                    "risk_score": audit.get("risk_score"),
                    "rules_checked": audit.get("rules_checked"),
                    "results": audit.get("results")
                })

        return {
            "count": len(results),
            "results": results
        }

    except Exception as e:
        logger.error(f"Failed fetching audit results: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch audit results")