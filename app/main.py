from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from contextlib import asynccontextmanager
import traceback
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
    lifespan=lifespan,
    redirect_slashes=False
)

# --- BULLETPROOF CORS ---
# This custom middleware ensures CORS headers are present on EVERY response,
# even when the app crashes with a 500 error. Without this, browsers hide
# the real error behind a misleading "CORS policy" message.

ALLOWED_ORIGINS = [
    "https://docuaudit-ai.vercel.app",
    "https://docuaudit-lqjgxtn3p-nash0509s-projects.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
]

class CORSFixMiddleware(BaseHTTPMiddleware):
    """Adds CORS headers to ALL responses, including unhandled errors."""
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin", "")

        # Handle preflight OPTIONS requests immediately
        if request.method == "OPTIONS":
            response = Response(status_code=200)
            response.headers["Access-Control-Allow-Origin"] = origin or "*"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            response.headers["Access-Control-Allow-Headers"] = "*"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Max-Age"] = "600"
            return response

        try:
            response = await call_next(request)
        except Exception:
            # If the app crashes completely, return a 500 WITH cors headers
            response = JSONResponse(
                status_code=500,
                content={"detail": "Internal Server Error"}
            )

        # Add CORS headers to every response
        # Allow any origin that matches our list, or echo back for Vercel preview URLs
        if origin and (origin in ALLOWED_ORIGINS or ".vercel.app" in origin or "localhost" in origin):
            response.headers["Access-Control-Allow-Origin"] = origin
        else:
            response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response

# Add our custom CORS middleware (replaces CORSMiddleware)
app.add_middleware(CORSFixMiddleware)

# Standard API routes with /api prefix
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(audit.router, prefix="/api/audit", tags=["Audit"])
app.include_router(rules.router, prefix="/api/rules", tags=["Rules"])
app.include_router(settings.router, prefix="/api/settings", tags=["Settings"])
app.include_router(activity.router, prefix="/api/activities", tags=["Activity"])
app.include_router(notification.router, prefix="/api/notifications", tags=["Notification"])
app.include_router(billing.router, prefix="/api/billing", tags=["Billing"])

# Fallback routes without /api prefix for maximum compatibility
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(documents.router, prefix="/documents", tags=["Documents"])
app.include_router(audit.router, prefix="/audit", tags=["Audit"])
app.include_router(rules.router, prefix="/rules", tags=["Rules"])
app.include_router(settings.router, prefix="/settings", tags=["Settings"])
app.include_router(activity.router, prefix="/activities", tags=["Activity"])
app.include_router(notification.router, prefix="/notifications", tags=["Notification"])
app.include_router(billing.router, prefix="/billing", tags=["Billing"])

# --- GLOBAL DIAGNOSTICS ---

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all for 500 errors to show the REAL error in production."""
    err_trace = traceback.format_exc()
    print(f"🔥 FATAL ERROR: {str(exc)}\n{err_trace}")
    origin = request.headers.get("origin", "*")
    response = JSONResponse(
        status_code=500,
        content={
            "detail": "Internal Server Error",
            "error_message": str(exc),
            "error_type": type(exc).__name__,
            "recommendation": "Check Render logs for the full stack trace."
        }
    )
    # Ensure CORS headers are present even on error responses
    response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@app.get("/")
def health_check():
    return {"status": "ok", "product": "DocuAudit AI"}