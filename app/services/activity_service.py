from sqlalchemy.orm import Session
from app.models.activity import Activity

def log_activity(
    db: Session,
    user_id: str,
    action: str,
    entity_type: str,
    entity_id: str,
    description: str
) -> Activity:
    activity_record = Activity(
        user_id=user_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        description=description
    )
    
    db.add(activity_record)
    db.commit()
    db.refresh(activity_record)
    
    return activity_record

def get_recent_activities(
    db: Session, 
    user_id: str, 
    limit: int = 10
):
    return (
        db.query(Activity)
        .filter(Activity.user_id == user_id)
        .order_by(Activity.created_at.desc())
        .limit(limit)
        .all()
    )
