from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON
from app.core.database import Base

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    strictness = Column(String, default="STANDARD")  # RELAXED, STANDARD, STRICT
    confidence_threshold = Column(Integer, default=70)
    
    context_chunks = Column(Integer, default=5)
    analysis_depth = Column(String, default="Balanced") # Concise, Balanced, Detailed
    
    include_recommendations = Column(Boolean, default=True)
    include_citations = Column(Boolean, default=True)
    include_confidence = Column(Boolean, default=True)
    
    rule_toggles = Column(JSON, default={
        "payment": True,
        "liability": True,
        "ip": True,
        "termination": True,
        "nda": True
    })
