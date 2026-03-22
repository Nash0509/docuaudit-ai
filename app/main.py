from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import documents, audit, auth
from app.core.database import create_tables

create_tables()

app = FastAPI(title="DocuAudit AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(audit.router, prefix="/api/audit", tags=["Audit"])

@app.get("/")
def health_check():
    return {"status": "ok", "product": "DocuAudit AI"}