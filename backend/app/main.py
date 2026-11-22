from fastapi import FastAPI
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.db.session import get_db


app = FastAPI(title="CRM API")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get('/health/db')
def health_db(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {'status': 'ok, db connection is working'}