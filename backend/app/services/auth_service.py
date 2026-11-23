from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth import RegisterRequest


def get_user_by_firebase_uid(db: Session, uid: str) -> User | None:
    return db.scalar(select(User).where(User.firebase_uid == uid))


def register_user(db: Session, token: dict, data: RegisterRequest) -> User:
    user = User(
        firebase_uid=token["uid"],
        email=token["email"],
        first_name=data.first_name,
        last_name=data.last_name,
        middle_name=data.middle_name,
        phone=data.phone,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user