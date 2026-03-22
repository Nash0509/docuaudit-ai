import os
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from groq import Groq
import chromadb

load_dotenv()

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="documents")
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_embedding(text):
    return embedding_model.encode(text).tolist()

def retrieve(question, top_k=3):
    question_embedding = get_embedding(question)
    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=top_k
    )
    return results["documents"][0]

def ask(question):
    chunks = retrieve(question)
    context = "\n\n".join(chunks)

    prompt = f"""You are a helpful assistant. Answer the user's question using ONLY the context below.
If the answer is not in the context, say "I don't know based on the provided document."

Context:
{context}

Question: {question}
Answer:"""

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content

# Test it
while True:
    question = input("\nAsk a question (or type 'exit'): ")
    if question.lower() == "exit":
        break
    answer = ask(question)
    print(f"\nAnswer: {answer}")