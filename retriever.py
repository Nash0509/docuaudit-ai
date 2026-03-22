import os
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import chromadb

load_dotenv()

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="documents")

def get_embedding(text):
    return embedding_model.encode(text).tolist()

def retrieve(question, top_k=3):
    question_embedding = get_embedding(question)
    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=top_k
    )
    return results["documents"][0]

# Test it
question = "What is this guy specialize in ?"
relevant_chunks = retrieve(question)

print(f"Top 3 relevant chunks for: '{question}'\n")
for i, chunk in enumerate(relevant_chunks):
    print(f"--- Chunk {i+1} ---")
    print(chunk)
    print()