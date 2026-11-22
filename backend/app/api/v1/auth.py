from fastapi import Depends, APIRouter

from app.core.deps import get_firebase_token

router = APIRouter(prefix='/auth', tags=['auth'])

@router.get('/me')
def me(token: dict = Depends(get_firebase_token)):
    return {"uid:": token["uid"], 'email': token.get("email")}