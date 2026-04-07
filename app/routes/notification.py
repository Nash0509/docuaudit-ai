from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime

from app.core.database import get_db
from app.services.auth_service import get_current_user
from app.models.user import User

from app.services.notification_service import (
    get_recent_notifications,
    get_unread_count,
    mark_as_read,
    mark_all_as_read
)

router = APIRouter()

class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime
    entity_type: str
    entity_id: str

    class Config:
        from_attributes = True

@router.get("", response_model=List[NotificationResponse])
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        notifications = get_recent_notifications(db, current_user.id, limit=20)
        return notifications
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to retrieve notifications")

@router.get("/unread-count")
def read_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        count = get_unread_count(db, current_user.id)
        return {"count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to count unread notifications")

@router.put("/{notification_id}/read")
def read_single_notification(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = mark_as_read(db, notification_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification marked as read"}

@router.put("/read-all")
def read_all_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    mark_all_as_read(db, current_user.id)
    return {"message": "All notifications marked as read"}
