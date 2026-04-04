from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os

from app.services.ingest import ingest_document
from app.services.document_registry import document_registry
from app.core.logger import logger
from app.services.retrieval_service import retrieval_service

router = APIRouter()

DOCS_PATH="./docs"

os.makedirs(DOCS_PATH,exist_ok=True)


@router.post("/upload")
async def upload_document(
    file:UploadFile=File(...)
):

    if not file.filename.endswith(".pdf"):

        raise HTTPException(
            status_code=400,
            detail="Only PDF supported"
        )

    document_id=document_registry.register_document(
        file.filename
    )

    file_path=os.path.join(
        DOCS_PATH,
        document_id+".pdf"
    )

    with open(file_path,"wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    document_registry.update_status(
        document_id,
        "processing"
    )

    chunk_count=ingest_document(
        file_path,
        document_id
    )

    document_registry.update_chunks(
        document_id,
        chunk_count
    )

    return {

        "document_id":document_id,

        "filename":file.filename,

        "chunks":chunk_count,

        "status":"ready"

    }

@router.get("/list")
def list_documents():
 return document_registry.list()


@router.delete("/{document_id}")
def delete_document(document_id: str):

    try:

        document = document_registry.get(
            document_id
        )

        if not document:

            raise HTTPException(
                status_code=404,
                detail="Document not found"
            )


        # remove vectors
        try:
         retrieval_service.delete_document(document_id)
        except Exception:
         pass


        # remove uploaded file
        file_path = f"uploads/{document_id}.pdf"

        if os.path.exists(file_path):

            os.remove(file_path)


        # remove registry entry
        document_registry.delete(
            document_id
        )


        logger.info(
            f"Document fully deleted {document_id}"
        )


        return {

            "message":"Document deleted"

        }


    except Exception as e:

        logger.error(
            f"Delete failed {document_id}: {str(e)}"
        )

        raise HTTPException(

            status_code=500,

            detail="Delete failed"

        )
    
