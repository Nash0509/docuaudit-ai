from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.services.auth import register_user, authenticate_user, create_access_token

router = APIRouter()

class AuthRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(payload: AuthRequest, db: Session = Depends(get_db)):
    user = register_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=400, detail="Email already registered.")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "email": user.email}

@router.post("/login")
def login(payload: AuthRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "email": user.email}