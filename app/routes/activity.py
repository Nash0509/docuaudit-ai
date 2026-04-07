from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime

from app.core.database import get_db
from app.services.auth_service import get_current_user
from app.models.user import User
from app.services.activity_service import get_recent_activities

router = APIRouter()

class ActivityResponse(BaseModel):
    id: str
    action: str
    description: str
    entity_type: str
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("", response_model=List[ActivityResponse])
def get_activities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        activities = get_recent_activities(db, current_user.id, limit=10)
        return activities
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to retrieve activities")
