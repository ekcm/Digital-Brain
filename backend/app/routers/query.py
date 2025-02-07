from fastapi import APIRouter

router = APIRouter()

@router.get("/query", tags=["query"])
async def query():
    return {"message": "Hello from query"}