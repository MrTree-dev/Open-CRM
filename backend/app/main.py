from fastapi import FastAPI
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db
from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.api.v1.router import api_router
from app.core.firebase import init_firebase


app = FastAPI(title="CRM API")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get('/health/db')
def health_db(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {'status': 'ok, db connection is working'}

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_firebase()
    yield

app = FastAPI(title='CRM API', lifespan=lifespan)
app.include_router(api_router, prefix='/api/v1')