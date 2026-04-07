import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Use environment variable for PostgreSQL in production, fallback to SQLite locally
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./docuaudit.db")

# connect_args only needed for SQLite
if "sqlite" in DATABASE_URL:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    import app.models.user
    import app.models.document
    import app.models.rule
    import app.models.settings
    import app.models.activity
    import app.models.notification
    Base.metadata.create_all(bind=engine)