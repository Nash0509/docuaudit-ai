from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from app.core.config import EMBEDDING_MODEL
from app.services.vector_service import vector_service
from app.core.logger import logger
import os

embedding_model = SentenceTransformer(EMBEDDING_MODEL)

def load_pdf(path: str) -> str:
    reader = PdfReader(path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

def split_into_chunks(text: str, chunk_size=500, overlap=50) -> list:
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap
    return chunks

def get_embedding(text: str) -> list:
    return embedding_model.encode(text).tolist()

def ingest_document(file_path: str, doc_id: str) -> int:
    logger.info(f"Ingesting document {doc_id}")
    raw_text = load_pdf(file_path)
    chunks = split_into_chunks(raw_text)
    embeddings = [get_embedding(chunk) for chunk in chunks]

    # Use the consolidated vector service
    vector_service.store_chunks(doc_id, chunks, embeddings)

    # If in cloud mode, we also push the vectors to Supabase if not handled by VectorService
    if vector_service.use_cloud:
        from app.core.supabase import supabase
        if supabase:
            try:
                data = [
                    {
                        "document_id": doc_id,
                        "content": chunk,
                        "embedding": emb
                    } 
                    for chunk, emb in zip(chunks, embeddings)
                ]
                supabase.table("document_chunks").insert(data).execute()
                logger.info(f"Pushed {len(chunks)} chunks to Supabase pgvector")
            except Exception as e:
                logger.error(f"Failed to push chunks to Supabase: {str(e)}")

    return len(chunks)