import chromadb
from app.core.config import CHROMA_PATH

class VectorService:

    def __init__(self):
        self.client = chromadb.PersistentClient(path=CHROMA_PATH)

    def get_collection(self, name: str):
        return self.client.get_or_create_collection(name=name)

    def store_chunks(
        self,
        collection_name: str,
        chunks: list,
        embeddings: list
    ):

        collection = self.get_collection(collection_name)

        ids = [f"chunk_{i}" for i in range(len(chunks))]

        collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=chunks
        )

        return len(chunks)

    def search(
        self,
        collection_name: str,
        embedding: list,
        top_k: int = 3
    ):

        collection = self.get_collection(collection_name)

        results = collection.query(
            query_embeddings=[embedding],
            n_results=top_k
        )

        return results["documents"][0]


vector_service = VectorService()