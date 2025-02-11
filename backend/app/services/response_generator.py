from typing import List, Dict, Any
from app.database.retriever import SearchResult
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain.output_parsers import ResponseSchema, StructuredOutputParser

response_schema = [
    ResponseSchema(
        name="response", 
        description="The detailed response generated from the context. MUST include inline citations using [Source X] format", 
        type="string"
    ),
    ResponseSchema(
        name="sources", 
        description="List of source numbers (as integers) that were cited in the response using [Source X] format", 
        type="array"
    )
]

output_parser = StructuredOutputParser.from_response_schemas(response_schema)

class ResponseGenerator:
    def __init__(self):
        self.llm = ChatOpenAI(
            temperature=0.7,
            model="gpt-4o-mini"
        )

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

    async def generate_response(self, context: str, sources: List[Dict[str, str]], query: str) -> Dict[str, Any]:
        format_instructions = output_parser.get_format_instructions()
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a helpful assistant that generates responses based on provided sources. Your response MUST follow these rules:

            1. Use information ONLY from the provided sources
            2. In the 'response' field, you MUST cite sources inline using [Source X] format for EVERY piece of information
            3. If multiple sources support a point, cite all of them: [Source 1, Source 2]
            4. If you're unsure or the sources don't contain relevant information, say so
            5. In the 'sources' field, include ONLY the source numbers you actually cited in your response
            
            {format_instructions}"""),
            ("user", """Context:
            {context}

            Query: {query}""")
        ])

        chain = prompt | self.llm
        
        response = await chain.ainvoke({
            "context": context,
            "query": query,
            "format_instructions": format_instructions
        })

        parsed_response = output_parser.parse(response.content)
        
        referenced_sources = []
        for source_num in parsed_response["sources"]:
            if 0 <= source_num - 1 < len(sources):
                source = sources[source_num - 1]
                referenced_sources.append({
                    "name": source["name"],
                    "file_name": source["file_name"]
                })
        
        response_output = {
            "response": parsed_response["response"],
            "sources": referenced_sources
        }
        print(response_output)
        return response_output