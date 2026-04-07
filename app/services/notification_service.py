from sqlalchemy.orm import Session
from app.models.notification import Notification

def create_notification(
    db: Session,
    user_id: str,
    title: str,
    message: str,
    type: str,
    entity_type: str,
    entity_id: str
) -> Notification:
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=type,
        entity_type=entity_type,
        entity_id=entity_id
    )
    
    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    # FUTURE WEBHOOK/WEBSOCKET DISPATCH STUB
    # if websocket_manager.is_connected(user_id):
    #     websocket_manager.send_notification(user_id, notification)
        
    return notification

def get_recent_notifications(
    db: Session, 
    user_id: str, 
    limit: int = 20
):
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .limit(limit)
        .all()
    )

def get_unread_count(db: Session, user_id: str) -> int:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id, Notification.is_read == False)
        .count()
    )

def mark_as_read(db: Session, notification_id: str, user_id: str) -> bool:
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    
    if notification:
        notification.is_read = True
        db.commit()
        return True
    return False

def mark_all_as_read(db: Session, user_id: str):
    db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
