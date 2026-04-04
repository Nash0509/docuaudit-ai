from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.services.auth_service import get_current_user
from app.models.user import User
from app.models.rule import Rule
from app.services.rule_service import get_merged_rules

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
