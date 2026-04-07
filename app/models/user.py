from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Billing & Plan Tracking
    audit_count = Column(Integer, default=0)
    is_subscribed = Column(Boolean, default=False)
    stripe_customer_id = Column(String, nullable=True)
