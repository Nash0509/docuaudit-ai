from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.routes import documents, audit, auth, rules, settings, activity, notification, billing
from app.core.database import create_tables, SessionLocal
from app.services.rule_service import seed_default_rules
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database
    print("🚀 DocuAudit AI: Starting up...")
    try:
        # Check for DB URL
        db_url = os.getenv("DATABASE_URL")
        if not db_url:
            print("⚠️ WARNING: DATABASE_URL not set. Falling back to SQLite.")
            print("To use PostgreSQL on Render, add the DATABASE_URL environment variable.")
        
        print("🛠️ Running migrations and seeding default rules...")
        create_tables()
        with SessionLocal() as db:
            seed_default_rules(db)
        print("✅ Database initialized successfully.")
    except Exception as e:
        print(f"❌ ERROR: Database initialization failed: {str(e)}")
        # We don't raise here so the app can still boot and serve a health check or 503
    
    yield
    # Shutdown logic (if any)
    print("👋 DocuAudit AI: Shutting down...")

app = FastAPI(
    title="DocuAudit AI", 
    version="1.0.0",
    lifespan=lifespan
)

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