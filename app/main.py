from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import documents, audit, auth, rules, settings
from app.core.database import create_tables

create_tables()

# Seed default rules
from app.core.database import SessionLocal
from app.services.rule_service import seed_default_rules
with SessionLocal() as db:
    seed_default_rules(db)

import os

app = FastAPI(title="DocuAudit AI", version="1.0.0")

# Support frontend domain from environment variable (Vercel)
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
    frontend_url
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(audit.router, prefix="/api/audit", tags=["Audit"])
from app.routes import rules
app.include_router(rules.router, prefix="/api/rules", tags=["Rules"])
from app.routes import settings
app.include_router(settings.router, prefix="/api/settings", tags=["Settings"])
from app.routes import activity
app.include_router(activity.router, prefix="/api/activities", tags=["Activity"])
from app.routes import notification
app.include_router(notification.router, prefix="/api/notifications", tags=["Notification"])
from app.routes import billing
app.include_router(billing.router, prefix="/api/billing", tags=["Billing"])

@app.get("/")
def health_check():
    return {"status": "ok", "product": "DocuAudit AI"}