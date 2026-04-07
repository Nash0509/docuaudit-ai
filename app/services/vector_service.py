import os
from app.core.logger import logger

class VectorService:
    def __init__(self):
        self.use_cloud = os.getenv("DATABASE_URL") and "postgres" in os.getenv("DATABASE_URL")
        self.chroma_client = None
        
        if not self.use_cloud:
            import chromadb
            from app.core.config import CHROMA_PATH
            self.chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
            logger.info("Using local ChromaDB for vector operations")
        else:
            logger.info("Using cloud-hosted Postgres for vector operations")

    def get_collection(self, name: str):
        if self.use_cloud:
            return name
        return self.chroma_client.get_or_create_collection(name=name)

    def store_chunks(self, document_id: str, chunks: list, embeddings: list):
        if not self.use_cloud:
            collection = self.get_collection(document_id.replace(".pdf", ""))
            ids = [f"chunk_{i}" for i in range(len(chunks))]
            collection.add(ids=ids, embeddings=embeddings, documents=chunks)
            return len(chunks)
        else:
            # For cloud deployment with Supabase/Postgres, vectors are typically stored in a table
            # with a 'vector' type column. Since SQLAlchemy 2.0 + pgvector is heavy to set up, 
            # we recommend using the Supabase client for simple RPC calls or direct SQL.
            # In this deployment, we'll suggest indexing document_id in the DB.
            # (Actual SQL implementation would happen in the ingestion step)
            return len(chunks)

    def search(self, document_id: str, embedding: list, top_k: int = 3):
        if not self.use_cloud:
            collection = self.get_collection(document_id.replace(".pdf", ""))
            results = collection.query(query_embeddings=[embedding], n_results=top_k)
            return results["documents"][0]
        else:
            # Cloud search via Supabase RPC (vector_search)
            from app.core.supabase import supabase
            if not supabase:
                return []
                
            try:
                # This assumes an RPC function 'match_document_chunks' exists in Supabase
                response = supabase.rpc('match_document_chunks', {
                    'query_embedding': embedding,
                    'match_threshold': 0.5,
                    'match_count': top_k,
                    'filter_document_id': document_id
                }).execute()
                
                return [item['content'] for item in response.data]
            except Exception as e:
                logger.error(f"Cloud vector search failed: {str(e)}")
                return []

vector_service = VectorService()