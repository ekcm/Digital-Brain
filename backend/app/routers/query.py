from fastapi import APIRouter
from pydantic import BaseModel

class QueryRequest(BaseModel):
    message: str

router = APIRouter()

@router.post("/query", tags=["query"])
async def query(request: QueryRequest):
    return {"message": request.message + " (from backend!)"}