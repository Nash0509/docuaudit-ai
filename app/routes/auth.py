from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.auth_service import (
    UserCreate, 
    UserLogin, 
    register_user, 
    login_user,
    get_current_user
)
from app.models.user import User

router = APIRouter(tags=["Auth"])

@router.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    return register_user(db, user_data)

@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    return login_user(db, user_data)

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "created_at": current_user.created_at
    }

from pydantic import BaseModel
class PasswordUpdate(BaseModel):
    new_password: str

@router.put("/password")
def update_password(
    data: PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.services.auth_service import change_password
    success = change_password(db, current_user, data.new_password)
    if success:
        return {"message": "Password updated successfully"}
    from fastapi import HTTPException
    raise HTTPException(status_code=400, detail="Failed to update password")
