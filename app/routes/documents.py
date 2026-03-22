from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil, os
from app.services.ingest import ingest_document

router = APIRouter()

DOCS_PATH = "./docs"
os.makedirs(DOCS_PATH, exist_ok=True)

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_path = os.path.join(DOCS_PATH, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    chunk_count = ingest_document(file_path, file.filename)

    return {
        "message": "Document uploaded and ingested successfully.",
        "filename": file.filename,
        "chunks_stored": chunk_count
    }

@router.get("/list")
def list_documents():
    files = os.listdir(DOCS_PATH)
    pdfs = [f for f in files if f.endswith(".pdf")]
    return {"documents": pdfs, "count": len(pdfs)}