from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_firebase_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.schemas.user import UserRead
from app.services.auth_service import get_user_by_firebase_uid, register_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(
    data: RegisterRequest,
    token: dict = Depends(get_firebase_token),
    db: Session = Depends(get_db),
):
    if get_user_by_firebase_uid(db, token["uid"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь уже зарегистрирован",
        )
    return register_user(db, token, data)


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user