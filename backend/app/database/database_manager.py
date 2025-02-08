import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from typing import Optional, List, Dict, Any

load_dotenv()

class DatabaseManager:
    def __init__(self):
        self.pinecone_api_key = os.getenv("PINECONE_API_KEY")
        self.pinecone = Pinecone(self.pinecone_api_key)
        self.index_name = "digital-brain"
        self._index = None

    @property
    def index(self):
        """Lazy loading of index connection"""
        if self._index is None:
            self._index = self.get_or_create_index()
        return self._index

    def get_or_create_index(self) -> Optional[Any]:
        """Get existing index or create if it doesn't exist"""
        try:
            existing_indexes = [index_info["name"] for index_info in self.pinecone.list_indexes()]
            
            if self.index_name not in existing_indexes:
                self.pinecone.create_index(
                    name=self.index_name,
                    dimension=1536,
                    metric="cosine",
                    spec=ServerlessSpec(cloud="aws", region="us-east-1"),
                )
            
            return self.pinecone.Index(self.index_name)
        except Exception as e:
            print(f"Error with index operation: {e}")
            return None

    