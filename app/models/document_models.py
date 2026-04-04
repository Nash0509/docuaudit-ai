from pydantic import BaseModel

class DocumentUploadResponse(BaseModel):

    filename: str
    chunks_stored: int


class DocumentListResponse(BaseModel):

    documents: list