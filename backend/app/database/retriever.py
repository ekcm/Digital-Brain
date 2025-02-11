from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from .database_manager import DatabaseManager

@dataclass
class SearchResult:
    text: str
    score: float
    file_name: str
    file_key: Optional[str]

class Retriever:
    def __init__(self, db_manager: DatabaseManager = None):
        self.db_manager = db_manager or DatabaseManager()

    async def retrieve(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        score_threshold: float = 0.5
    ) -> List[SearchResult]:
        try:
            query_response = self.db_manager.index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True
            )
            
            results = []
            for match in query_response.matches:
                if match.score < score_threshold:
                    continue
                    
                results.append(SearchResult(
                    text=match.metadata["text"],
                    score=match.score,
                    file_name=match.metadata.get("original_filename", "Unknown"),
                    file_key=match.metadata.get("file_key")
                ))
            
            return results
            
        except Exception as e:
            print(f"Error during retrieval: {e}")
            return []
