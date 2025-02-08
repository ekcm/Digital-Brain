from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

class QueryRequest(BaseModel):
    message: str

router = APIRouter()

@router.post("/query", tags=["query"])
async def query(request: QueryRequest):
    return {"message": request.message + " (from backend!!!!!!!!)"}

@router.get("/openai", tags=["query"])
async def openai():
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    return {"message": f"Hello from OpenAI: {OPENAI_API_KEY}"}