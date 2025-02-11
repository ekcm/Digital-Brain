from langchain_openai import OpenAI, OpenAIEmbeddings
from langchain.chains import HypotheticalDocumentEmbedder
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class HydeGenerator:
    def __init__(self):
        self.llm = OpenAI(temperature=0)
        self.base_embeddings = OpenAIEmbeddings()
        
        # Initialize HypotheticalDocumentEmbedder with web_search prompt
        self.embeddings = HypotheticalDocumentEmbedder.from_llm(
            llm=self.llm,
            base_embeddings=self.base_embeddings,
            prompt_key="web_search"  # Using the web_search preset prompt
        )

    def generate_hyde_embeddings(self, query: str) -> List[float]:
        """
        Generate embeddings for a query using HyDE approach
        Args:
            query: The query to generate embeddings for
        Returns:
            List[float]: The generated embeddings
        """
        try:
            result = self.embeddings.embed_query(query)
            return result
        except Exception as e:
            print(f"Error generating HyDE embeddings: {e}")
            # Fallback to regular embeddings if HyDE fails
            return self.base_embeddings.embed_query(query)
