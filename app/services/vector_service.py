import os
from app.core.logger import logger

class VectorService:
    def __init__(self):
        # We are now focused on cloud deployment with Supabase/Postgres
        self.use_cloud = os.getenv("DATABASE_URL") and "postgres" in os.getenv("DATABASE_URL")
        
        if self.use_cloud:
            logger.info("Using cloud-hosted Postgres for vector operations")
        else:
            logger.warning("No cloud database detected. Vector search is disabled or running in local mock mode.")

    def get_collection(self, name: str):
        # Returns the document_id as the filter name
        return name

    def store_chunks(self, document_id: str, chunks: list, embeddings: list):
        if not self.use_cloud:
            logger.warning(f"Mock storage: Document {document_id} chunks not saved (Cloud mode off)")
            return 0
        
        # Cloud storage logic is handled in the ingestion step via Supabase client
        return len(chunks)

    def search(self, document_id: str, embedding: list, top_k: int = 3):
        if not self.use_cloud:
            logger.warning(f"Mock search: Returning empty results (Cloud mode off)")
            return []

        # Cloud search via Supabase RPC (vector_search)
        from app.core.supabase import supabase
        if not supabase:
            logger.error("Supabase client not initialized")
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