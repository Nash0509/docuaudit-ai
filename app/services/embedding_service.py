from sentence_transformers import SentenceTransformer
from app.core.config import EMBEDDING_MODEL

class EmbeddingService:

    def __init__(self):
        self.model = SentenceTransformer(EMBEDDING_MODEL)

    def embed_text(self, text: str) -> list:
        return self.model.encode(text).tolist()

    def embed_batch(self, texts: list) -> list:
        return self.model.encode(texts).tolist()


embedding_service = EmbeddingService()