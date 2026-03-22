from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import chromadb
from app.core.config import CHROMA_PATH, EMBEDDING_MODEL

embedding_model = SentenceTransformer(EMBEDDING_MODEL)
chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)

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
    collection = chroma_client.get_or_create_collection(name=doc_id.replace(".pdf", ""))
    raw_text = load_pdf(file_path)
    chunks = split_into_chunks(raw_text)

    for i, chunk in enumerate(chunks):
        embedding = get_embedding(chunk)
        collection.add(
            ids=[f"chunk_{i}"],
            embeddings=[embedding],
            documents=[chunk]
        )

    return len(chunks)