from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Union, Any
from app.services.hyde_generator import HydeGenerator
from app.database.retriever import Retriever

class QueryRequest(BaseModel):
    """Request model for query endpoint"""
    message: str

class QueryResponse(BaseModel):
    """Response model for query endpoint"""
    query: str
    matches: List[Dict[str, Any]]

router = APIRouter(
    prefix="/query",
    tags=["query"]
)

@router.post("/", response_model=Union[QueryResponse, Dict[str, str]])
async def query(request: QueryRequest) -> Union[QueryResponse, Dict[str, str]]:
    try:
        hyde_generator = HydeGenerator()
        query_embedding = hyde_generator.generate_hyde_embeddings(request.message)
        
        # Retrieve similar documents
        retriever = Retriever()
        matches = await retriever.retrieve(
            query_embedding=query_embedding,
            top_k=3,
            score_threshold=0.5  # Only return results with >0.5 similarity
        )
        
        return QueryResponse(
            query=request.message,
            matches=[
                {
                    "text": match.text,
                    "score": match.score,
                    "file_name": match.file_name,
                    "file_key": match.file_key
                }
                for match in matches
            ]
        )
    except Exception as e:
        return {"error": f"Query failed: {str(e)}"}
