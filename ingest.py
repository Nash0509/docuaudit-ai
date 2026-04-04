from pypdf import PdfReader
from app.services.embedding_service import embedding_service
from app.services.vector_service import vector_service
from app.core.logger import logger


def load_pdf(path: str):

    logger.info(f"Loading PDF: {path}")

    try:

        reader = PdfReader(path)

        text = ""

        for page in reader.pages:

            text += page.extract_text() or ""

        logger.info("PDF loaded successfully")

        return text

    except Exception as e:

        logger.error(f"PDF loading failed: {str(e)}")

        raise Exception("Failed to read PDF")


def split_into_chunks(

    text: str,

    chunk_size=500,

    overlap=50

):

    logger.info("Starting text chunking")

    chunks = []

    start = 0

    while start < len(text):

        end = start + chunk_size

        chunks.append(text[start:end])

        start = end - overlap

    logger.info(f"Created {len(chunks)} chunks")

    return chunks


def ingest_document(

    file_path: str,

    document_id: str

):

    logger.info(f"Starting ingestion for document {document_id}")

    try:

        raw_text = load_pdf(file_path)

        if not raw_text.strip():

            logger.warning("PDF text empty")

            raise Exception("Document contains no readable text")

        chunks = split_into_chunks(raw_text)

        logger.info("Generating embeddings")

        embeddings = embedding_service.embed_batch(chunks)

        logger.info("Storing vectors")

        count = vector_service.store_chunks(

            document_id,

            chunks,

            embeddings

        )

        logger.info(
            f"Ingestion complete for {document_id} | Stored {count} chunks"
        )

        return count

    except Exception as e:

        logger.error(
            f"Ingestion failed for {document_id}: {str(e)}"
        )

        raise e