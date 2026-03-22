import os
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import chromadb

load_dotenv()

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="documents")

def load_pdf(path):
    reader = PdfReader(path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def split_into_chunks(text, chunk_size=500, overlap=50):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap
    return chunks

def get_embedding(text):
    return embedding_model.encode(text).tolist()

def store_chunks(chunks):
    for i, chunk in enumerate(chunks):
        embedding = get_embedding(chunk)
        collection.add(
            ids=[f"chunk_{i}"],
            embeddings=[embedding],
            documents=[chunk]
        )
    print(f"Stored {len(chunks)} chunks in ChromaDB")

raw_text = load_pdf("docs/resume_nishant_me.pdf")
chunks = split_into_chunks(raw_text)
store_chunks(chunks)