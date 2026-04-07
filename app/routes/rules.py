from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.services.auth_service import get_current_user
from app.models.user import User
from app.models.rule import Rule
from app.services.rule_service import get_merged_rules
from app.services.activity_service import log_activity
from app.services.notification_service import create_notification
from app.services.email_service import send_email

router = APIRouter()

class RuleCreate(BaseModel):
    name: str
    description: str
    severity: str
    category: str

@router.post("")
def create_rule(
    rule_data: RuleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_rule = Rule(
        name=rule_data.name,
        description=rule_data.description,
        severity=rule_data.severity,
        category=rule_data.category,
        user_id=current_user.id,
        is_template=False
    )
    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)

    log_activity(
        db=db,
        user_id=current_user.id,
        action="RULE_CREATED",
        entity_type="rule",
        entity_id=new_rule.id,
        description=f"Created rule {new_rule.name}"
    )
    
    create_notification(
        db=db,
        user_id=current_user.id,
        title="Rule Created",
        message=f"Created rule {new_rule.name}",
        type="SUCCESS",
        entity_type="rule",
        entity_id=new_rule.id
    )

    # Send Email (Pro Subscribers Only)
    if current_user.is_subscribed:
        send_email(
            to_email=current_user.email,
            subject=f"DocuAudit AI: New Compliance Rule Created",
            title="Rule Created",
            message=f"Your custom compliance rule <strong>{new_rule.name}</strong> has been saved and is now active. It will be applied in future audits when selected.",
            type="SUCCESS"
        )

    return new_rule

@router.get("")
def get_rules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_merged_rules(db, current_user.id)

@router.delete("/{rule_id}")
def delete_rule(
    rule_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rule = db.query(Rule).filter(Rule.id == rule_id).first()
    
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
        
    if rule.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden: You can only delete your own rules")
        
    db.delete(rule)
    db.commit()

    log_activity(
        db=db,
        user_id=current_user.id,
        action="RULE_DELETED",
        entity_type="rule",
        entity_id=rule.id,
        description=f"Deleted rule {rule.name}"
    )

    return {"message": "Rule deleted"}

@router.put("/{rule_id}")
def update_rule(
    rule_id: str,
    rule_data: RuleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rule = db.query(Rule).filter(Rule.id == rule_id).first()
    
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
        
    if rule.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden: You can only edit your own rules")
        
    rule.name = rule_data.name
    rule.description = rule_data.description
    rule.severity = rule_data.severity
    rule.category = rule_data.category
    
    db.commit()
    db.refresh(rule)
    return rule
