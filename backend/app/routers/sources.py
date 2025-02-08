from fastapi import APIRouter, UploadFile, File
import pdfplumber
import io

from app.database.database_manager import DatabaseManager
from app.services.text_splitter import TextSplitter

router = APIRouter(
    prefix="/sources",
    tags=["sources"]
)

@router.get("/")
async def sources():
    return {"message": "Hello from sources"}

@router.post("/")
async def upload_source(
    file: UploadFile = File(...),
):
    if not file.filename.endswith('.pdf'):
        return {"error": "Only PDF files are supported"}

    try:
        # Read file content
        content = await file.read()
        file_obj = io.BytesIO(content)
        file_obj.filename = file.filename  # Add filename attribute for metadata

        # Split PDF into chunks
        text_splitter = TextSplitter()
        document_chunks = text_splitter.split_pdf_text(file_obj)

        if not document_chunks:
            return {"error": "Failed to process PDF"}

        # Upload documents to Pinecone
        db_manager = DatabaseManager()
        success = await db_manager.upload_documents(document_chunks)

        if not success:
            return {"error": "Failed to upload to vector database"}

        return {
            "message": f"Successfully processed and uploaded {file.filename}",
            "chunks": len(document_chunks),
            "first_chunk_preview": document_chunks[0]["text"][:200] if document_chunks else None
        }

    except Exception as e:
        return {"error": f"Error processing file: {str(e)}"}

@router.get("/index")
async def index():
    db_manager = DatabaseManager()
    index = db_manager.index
    return {"message": "Hello from index: " + str(index)}