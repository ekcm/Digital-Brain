import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from typing import Optional, List, Dict, Any
from openai import OpenAI

load_dotenv()

class DatabaseManager:
    def __init__(self):
        self.pinecone_api_key = os.getenv("PINECONE_API_KEY")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.pinecone = Pinecone(self.pinecone_api_key)
        self.openai_client = OpenAI(api_key=self.openai_api_key)
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

    def _get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Get embeddings for a list of texts using OpenAI"""
        try:
            response = self.openai_client.embeddings.create(
                model="text-embedding-ada-002",
                input=texts
            )
            return [embedding.embedding for embedding in response.data]
        except Exception as e:
            print(f"Error getting embeddings: {e}")
            return []

    async def upload_documents(self, documents: List[Dict[str, Any]]) -> bool:
        """
        Upload documents to Pinecone with embeddings
        Args:
            documents: List of dictionaries containing text and metadata
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            if not self.index:
                return False

            # Extract texts for embedding
            texts = [doc["text"] for doc in documents]
            
            # Get embeddings in batches of 100 (OpenAI limit)
            batch_size = 100
            vectors = []
            
            for i in range(0, len(texts), batch_size):
                batch_texts = texts[i:i + batch_size]
                batch_embeddings = self._get_embeddings(batch_texts)
                
                # Create vectors for Pinecone
                for j, embedding in enumerate(batch_embeddings):
                    doc_index = i + j
                    vectors.append({
                        "id": documents[doc_index]["chunk_id"],
                        "values": embedding,
                        "metadata": {
                            "text": documents[doc_index]["text"],
                            **documents[doc_index]["metadata"]
                        }
                    })
            
            # Upload to Pinecone in batches
            batch_size = 100
            for i in range(0, len(vectors), batch_size):
                batch = vectors[i:i + batch_size]
                self.index.upsert(vectors=batch)
            
            return True
        except Exception as e:
            print(f"Error uploading documents: {e}")
            return False

    async def delete_all_documents(self):
        """
        Delete all documents from the Pinecone index
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            if not self.index:
                return False
            
            self.index.delete(delete_all=True)
            return True
        except Exception as e:
            print(f"Error deleting all documents: {e}")
            return False