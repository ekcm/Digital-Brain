from fastapi import APIRouter
from app.storage.storage_manager import S3StorageManager

router = APIRouter(
    prefix="/storage",
    tags=["storage"]
)

@router.get("/file")
async def get_all_files():
    try:
        storage_manager = S3StorageManager()
        return storage_manager.list_files()
    except Exception as e:
        return {"error": f"Failed to list files: {str(e)}"}

@router.get("/file/{file_key}")
async def get_presigned_url(file_key: str):
    try:
        storage_manager = S3StorageManager()
        file_url = storage_manager.get_file_url(file_key)
        return {"file_url": file_url}
    except Exception as e:
        return {"error": f"Failed to get file: {str(e)}"}
