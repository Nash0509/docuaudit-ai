from fastapi import APIRouter, HTTPException
from app.services.audit_service import audit_service
from app.services.document_registry import document_registry
from app.core.logger import logger

router = APIRouter()


@router.post("/run/{document_id}")
def run_audit(document_id: str):

    try:

        document = document_registry.get(
            document_id
        )

        if not document:

            raise HTTPException(
                status_code=404,
                detail="Document not found"
            )


        result = audit_service.run_audit(
            document_id
        )

        return result


    except Exception as e:

        logger.error(
            f"Audit failed {document_id}: {str(e)}"
        )

        raise HTTPException(

            status_code=500,

            detail="Audit failed"

        )


@router.get("/result/{document_id}")
def get_audit_result(document_id: str):

    try:

        document = document_registry.get(
            document_id
        )

        if not document:

            raise HTTPException(
                status_code=404,
                detail="Document not found"
            )


        result = document.get(
            "audit_result"
        )

        if not result:

            raise HTTPException(
                status_code=404,
                detail="Audit result not found"
            )


        # Add filename to response
        result["filename"] = document.get(
            "filename"
        )

        result["uploaded_at"] = document.get(
            "uploaded_at"
        )

        return result


    except Exception as e:

        logger.error(
            f"Failed fetching audit {document_id}: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch audit result"
        )

    try:

        result = document_registry.get_audit_result(

            document_id

        )


        if not result:

            raise HTTPException(

                status_code=404,

                detail="Audit result not found"

            )


        return result


    except Exception as e:

        logger.error(

            f"Failed fetching audit {document_id}: {str(e)}"

        )

        raise HTTPException(

            status_code=500,

            detail="Failed to fetch audit result"

        )


@router.get("/results")
def get_all_audit_results():

    try:

        documents = document_registry.list()

        results = []

        for doc_id, doc in documents.items():

            audit = doc.get("audit_result")

            if audit:

                results.append({

                    "document": doc_id,

                    "filename": doc.get("filename"),

                    "uploaded_at": doc.get("uploaded_at"),

                    "risk_score": audit.get("risk_score"),

                    "rules_checked": audit.get("rules_checked"),

                    "results": audit.get("results")

                })

        return {

            "count": len(results),

            "results": results

        }

    except Exception as e:

        logger.error(
            f"Failed fetching audit results: {str(e)}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch audit results"
        )