import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt

from app.models.user import User
from app.core import security
from app.core.database import get_db
from app.services.email_service import send_email

logger = logging.getLogger(__name__)

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def register_user(db: Session, user_data: UserCreate):
    try:
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        hashed_password = security.get_password_hash(user_data.password)
        new_user = User(email=user_data.email, hashed_password=hashed_password)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        send_email(
            to_email=new_user.email,
            subject="Welcome to DocuAudit AI",
            title="Welcome Aboard",
            message="Your account has been created successfully. You can now start auditing documents with AI.",
            type="SUCCESS"
        )
        
        return {
            "message": "User registered successfully", 
            "user_id": new_user.id
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        logger.error(f"Registration failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

def login_user(db: Session, user_data: UserLogin):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not security.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = security.create_access_token(data={"sub": str(user.id)})
    
    send_email(
        to_email=user.email,
        subject="Login Alert - DocuAudit AI",
        title="New Login Detected",
        message="A new login to your DocuAudit AI account was successfully completed.",
        type="INFO"
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }

import secrets

def login_guest(db: Session):
    try:
        guest_email = "guest@docuaudit.ai"
        user = db.query(User).filter(User.email == guest_email).first()
        
        if not user:
            # Create guest user if it doesn't exist
            random_password = secrets.token_urlsafe(16)
            hashed_password = security.get_password_hash(random_password)
            user = User(email=guest_email, hashed_password=hashed_password)
            db.add(user)
            db.commit()
            db.refresh(user)

        access_token = security.create_access_token(data={"sub": str(user.id)})
        return {
            "access_token": access_token, 
            "token_type": "bearer"
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Guest login failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Guest login failed: {str(e)}"
        )

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
        
    return user

def change_password(db: Session, user: User, new_password: str):
    user.hashed_password = security.get_password_hash(new_password)
    db.commit()
    return True
