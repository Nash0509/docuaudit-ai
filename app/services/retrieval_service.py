from app.services.embedding_service import embedding_service
from app.services.vector_service import vector_service

class RetrievalService:

    def retrieve(
        self,
        collection_name: str,
        question: str,
        top_k: int = 3
    ):

        embedding = embedding_service.embed_text(question)

        documents = vector_service.search(
            collection_name,
            embedding,
            top_k
        )

        return documents

    def delete_document(self, document_id):

     try:

        if hasattr(self,"vector_store"):

            if document_id in self.vector_store:

                del self.vector_store[document_id]

     except Exception:

        pass


retrieval_service = RetrievalService()