from typing import List, Dict, Any
from app.database.retriever import SearchResult
from langchain.prompts import PromptTemplate
from langchain_openai import OpenAI

class ResponseGenerator:
    def __init__(self):
        self.llm = OpenAI(temperature=0.7)

    async def format_documents(self, retrieved_docs: List[SearchResult], query: str) -> Dict[str, Any]:
        formatted_context = ""
        sources = []

        for i, doc in enumerate(retrieved_docs):
            sources_name = f"Source {i + 1}"
            formatted_context += f"{sources_name}: {doc.text}\n\n"
            sources.append({
                "name": sources_name,
                "content": doc.text,
                "file_name": doc.file_name
            })

        return {"context": formatted_context, "sources": sources}

    async def generate_response(self, context: str, sources: List[Dict[str, str]], query: str) -> str:
        prompt = PromptTemplate.from_template(
            """You are a helpful assistant that generates responses based on provided sources. Follow these rules:

            1. Use information ONLY from the provided sources
            2. Cite sources inline using [Source X] format
            3. If multiple sources support a point, cite all of them: [Source 1, Source 2]
            4. If you're unsure or the sources don't contain relevant information, say so
            5. At the end, list all sources used and their filenames
            
            Context:
            {context}

            Query: {query}

            Response (with inline citations):"""
        )

        chain = prompt | self.llm
        
        response = await chain.ainvoke({
            "context": context,
            "query": query
        })
        
        # Add source filenames at the end
        response_with_sources = response + "\n\nSources Referenced:\n"
        for source in sources:
            response_with_sources += f"{source['name']}: {source['file_name']}\n"
        
        return response_with_sources