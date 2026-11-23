from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth as firebase_auth

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.services.auth_service import get_user_by_firebase_uid

bearer_scheme = HTTPBearer(auto_error=False)

def get_firebase_token(
        credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> dict:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    try:
        return firebase_auth.verify_id_token(credentials.credentials)
    except (ValueError, firebase_auth.InvalidIdTokenError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

def get_current_user(
    token: dict = Depends(get_firebase_token),
    db: Session = Depends(get_db),
) -> User:
    user = get_user_by_firebase_uid(db, token["uid"])
    if user is None:
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не зарегистрирован",
        )
    if not user.is_active:
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,   
            detail="Пользователь деактивирован",
        )
    return user