from fastapi import APIRouter, File, UploadFile
import io
from app.database.database_manager import DatabaseManager
from app.storage.storage_manager import S3StorageManager
from app.services.text_splitter import TextSplitter

router = APIRouter(
    prefix="/sources",
    tags=["sources"]
)

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

        # Upload file to s3 bucket
        storage_manager = S3StorageManager(init_bucket=True)  # Ensure bucket exists
        file_key = storage_manager.upload_file(file_obj)

        # Add file_key to each document chunk
        for chunk in document_chunks:
            chunk['metadata']['file_key'] = file_key
            chunk['metadata']['original_filename'] = file.filename

        # Upload documents to Pinecone
        db_manager = DatabaseManager()
        success = await db_manager.upload_documents(document_chunks)
        
        if not success:
            return {"error": "Failed to upload documents to database"}

        # Generate a presigned URL for immediate access
        file_url = storage_manager.get_file_url(file_key)
        
        return {
            "message": "File uploaded successfully",
            "file_key": file_key,
            "file_url": file_url
        }

    except Exception as e:
        print(f"Error in upload: {str(e)}")
        return {"error": f"Upload failed: {str(e)}"}

@router.delete("/")
async def delete_all_sources():
    # Delete from Pinecone
    db_manager = DatabaseManager()
    db_success = await db_manager.delete_all_documents()
    
    # Delete from S3
    storage_manager = S3StorageManager()
    s3_success = storage_manager.delete_all_files()
    
    if not db_success or not s3_success:
        return {
            "error": "Failed to delete all content",
            "details": {
                "pinecone": "Failed" if not db_success else "Success",
                "s3": "Failed" if not s3_success else "Success"
            }
        }
    
    return {"message": "Successfully deleted all documents and files"}