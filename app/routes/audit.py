from fastapi import APIRouter
from fastapi.responses import Response
from pydantic import BaseModel
from app.services.auditor import run_audit
from app.services.pdf_exporter import generate_audit_pdf

router = APIRouter()

class AuditRequest(BaseModel):
    doc_id: str

@router.post("/run")
def run_audit_endpoint(payload: AuditRequest):
    return run_audit(payload.doc_id)

@router.post("/export-pdf")
def export_pdf(payload: AuditRequest):
    report = run_audit(payload.doc_id)
    if "error" in report:
        return report
    pdf_bytes = generate_audit_pdf(report)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=audit_{payload.doc_id}.pdf"}
    )