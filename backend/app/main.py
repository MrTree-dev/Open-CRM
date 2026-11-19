from fastapi import FastAPI

app = FastAPI(title="CRM API")

@app.get("/health")
def health():
    return {"status": "ok"}