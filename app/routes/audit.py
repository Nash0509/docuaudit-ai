from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.services.audit_service import audit_service
from app.core.logger import logger
from app.core.database import get_db
from app.services.auth_service import get_current_user
from app.models.user import User
from app.models.document import Document
from app.models.settings import UserSettings
from app.services.activity_service import log_activity
from app.services.notification_service import create_notification
from app.services.email_service import send_email

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

        if current_user.audit_count >= 1 and not current_user.is_subscribed:
            raise HTTPException(status_code=402, detail="TRIAL_ENDED")
            
        settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
        result = audit_service.run_audit(document_id, request.rule_ids, db, settings)
        
        current_user.audit_count += 1
        document.audited = True
        document.audit_result = result
        db.commit()

        # Log Audit Run Activity
        log_activity(
            db=db,
            user_id=current_user.id,
            action="AUDIT_RUN",
            entity_type="audit",
            entity_id=document_id,
            description=f"Ran audit on {document.filename}"
        )
        
        # Dispatch Notification depending on risk logic
        risk_score = result.get('risk_score', 0)
        risk_type = "WARNING" if risk_score > 70 else "SUCCESS"
        risk_title = "High Risk Detected" if risk_score > 70 else "Audit Completed"
        risk_msg = f"High risk detected for {document.filename}" if risk_score > 70 else f"Audit finished for {document.filename}"
        
        create_notification(
            db=db,
            user_id=current_user.id,
            title=risk_title,
            message=risk_msg,
            type=risk_type,
            entity_type="audit",
            entity_id=document_id
        )

        # Send Email — subject and body adjust based on risk level
        email_body = (
            f"Your document <strong>{document.filename}</strong> was flagged with a "
            f"<strong>high risk score of {risk_score}</strong>. Immediate review is recommended "
            f"to address the compliance violations found."
            if risk_score > 70
            else
            f"The compliance audit for <strong>{document.filename}</strong> completed successfully "
            f"with a risk score of <strong>{risk_score}</strong>. Review the full report for details."
        )
        if current_user.is_subscribed:
            send_email(
                to_email=current_user.email,
                subject=f"DocuAudit AI: {risk_title} — {document.filename}",
                title=risk_title,
                message=email_body,
                type=risk_type,
                action_label="View Audit Report",
                action_url=f"http://localhost:5173/report/{document_id}"
            )

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