from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Union, Any
from app.services.hyde_generator import HydeGenerator
from app.database.retriever import Retriever
from app.services.response_generator import ResponseGenerator

class QueryRequest(BaseModel):
    """Request model for query endpoint"""
    message: str

class QueryResponse(BaseModel):
    """Response model for query endpoint"""
    query: str
    response: str
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
        
        retriever = Retriever()
        matches = await retriever.retrieve(query_embedding)
        
        response_generator = ResponseGenerator()
        formatted_documents = await response_generator.format_documents(matches, request.message)
        
        response = await response_generator.generate_response(
            formatted_documents["context"],
            formatted_documents["sources"],
            request.message
        )
        
        return QueryResponse(
            query=request.message,
            response=response,
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
