from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from .database_manager import DatabaseManager

@dataclass
class SearchResult:
    """Data class for storing search results"""
    text: str
    score: float
    file_name: str
    file_key: Optional[str]

class Retriever:
    def __init__(self, db_manager: DatabaseManager = None):
        """
        Initialize retriever with optional database manager
        Args:
            db_manager: DatabaseManager instance. If None, creates new instance.
        """
        self.db_manager = db_manager or DatabaseManager()

    async def retrieve(
        self,
        query_embedding: List[float],
        top_k: int = 3,
        score_threshold: float = 0.0
    ) -> List[SearchResult]:
        """
        Retrieve most similar documents using vector similarity search
        Args:
            query_embedding: Query vector to search with
            top_k: Number of results to return
            score_threshold: Minimum similarity score threshold
        Returns:
            List of SearchResult objects containing matched documents
        """
        try:
            # Query the vector store
            query_response = self.db_manager.index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True
            )
            
            # Process and filter results
            results = []
            for match in query_response.matches:
                # Skip results below threshold
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

    async def retrieve_with_metadata_filter(
        self,
        query_embedding: List[float],
        metadata_filter: Dict[str, Any],
        top_k: int = 3,
        score_threshold: float = 0.0
    ) -> List[SearchResult]:
        """
        Retrieve documents with metadata filtering
        Args:
            query_embedding: Query vector to search with
            metadata_filter: Dictionary of metadata filters
            top_k: Number of results to return
            score_threshold: Minimum similarity score threshold
        Returns:
            List of SearchResult objects containing matched documents
        """
        try:
            # Query with metadata filter
            query_response = self.db_manager.index.query(
                vector=query_embedding,
                filter=metadata_filter,
                top_k=top_k,
                include_metadata=True
            )
            
            # Process and filter results
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
            print(f"Error during filtered retrieval: {e}")
            return []
