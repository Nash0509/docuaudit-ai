from fastembed import TextEmbedding
from app.core.config import EMBEDDING_MODEL

class EmbeddingService:

    def __init__(self):
        # fastembed uses 'BAAI/bge-small-en-v1.5' by default, 
        # but we can specify the model to match our previous one 
        # for compatibility if needed. 'sentence-transformers/all-MiniLM-L6-v2' 
        # is a standard supported model.
        self.model = TextEmbedding(model_name=f"sentence-transformers/{EMBEDDING_MODEL}")

    def embed_text(self, text: str) -> list:
        # embed() returns a generator, we cast to list and take the first item
        result = list(self.model.embed([text]))
        return result[0].tolist()

    def embed_batch(self, texts: list) -> list:
        result = list(self.model.embed(texts))
        return [item.tolist() for item in result]


embedding_service = EmbeddingService()