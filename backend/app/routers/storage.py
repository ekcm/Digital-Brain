from fastapi import APIRouter, UploadFile, File, HTTPException
from app.storage.storage_manager import S3StorageManager
from app.database.database_manager import DatabaseManager

router = APIRouter(
    prefix="/storage",
    tags=["storage"]
)

@router.get("/")
async def get_all_files():
    try:
        storage_manager = S3StorageManager()
        return storage_manager.list_files()
    except Exception as e:
        return {"error": f"Failed to list files: {str(e)}"}

@router.get("/{file_key}")
async def get_presigned_url(file_key: str):
    try:
        storage_manager = S3StorageManager()
        file_url = storage_manager.get_file_url(file_key)
        return {"file_url": file_url}
    except Exception as e:
        return {"error": f"Failed to get file: {str(e)}"}

@router.get("/filename/{filename}")
async def get_presigned_url_by_name(filename: str):
    """
    Get a presigned URL for a file using its original filename.
    First looks up the file_key in the database, then generates a presigned URL.
    """
    try:
        db_manager = DatabaseManager()
        file_key = db_manager.get_file_key_by_name(filename)
        
        if not file_key:
            raise HTTPException(status_code=404, detail=f"File not found: {filename}")
            
        storage_manager = S3StorageManager()
        file_url = storage_manager.get_file_url(file_key)
        
        return {"file_url": file_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get file URL: {str(e)}")
