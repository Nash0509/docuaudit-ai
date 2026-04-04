from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any

from app.core.database import get_db
from app.services.auth_service import get_current_user
from app.models.user import User
from app.models.settings import UserSettings

router = APIRouter()

class SettingsUpdate(BaseModel):
    strictness: str
    confidence_threshold: int
    context_chunks: int
    analysis_depth: str
    include_recommendations: bool
    include_citations: bool
    include_confidence: bool
    rule_toggles: Dict[str, Any]

@router.get("")
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    
    if not settings:
        # Create default settings if it doesn't exist
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
        
    return settings

@router.put("")
def update_settings(
    settings_data: SettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
        
    settings.strictness = settings_data.strictness
    settings.confidence_threshold = settings_data.confidence_threshold
    settings.context_chunks = settings_data.context_chunks
    settings.analysis_depth = settings_data.analysis_depth
    settings.include_recommendations = settings_data.include_recommendations
    settings.include_citations = settings_data.include_citations
    settings.include_confidence = settings_data.include_confidence
    settings.rule_toggles = settings_data.rule_toggles
    
    db.commit()
    db.refresh(settings)
    return settings
