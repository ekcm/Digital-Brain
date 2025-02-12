from langchain_text_splitters import RecursiveCharacterTextSplitter
import pdfplumber
from typing import List, Dict

class TextSplitter:
    def __init__(self):
        self.chunk_size = 1000
        self.chunk_overlap = 200
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )

    def split_pdf_text(self, file) -> List[Dict[str, str]]:
        """
        Split PDF content into chunks using recursive character splitting
        Args:
            file: File object from FastAPI
        Returns:
            List of dictionaries containing text chunks and metadata
        """
        try:
            # Extract text from PDF
            with pdfplumber.open(file) as pdf:
                text = ""
                for page_num, page in enumerate(pdf.pages, 1):
                    text += f"\n\nPage {page_num}\n\n" + page.extract_text()

            # Split text into chunks
            chunks = self.text_splitter.create_documents([text])
            
            # Convert chunks to dictionary format
            documents = []
            for i, chunk in enumerate(chunks):
                document_id = file.filename.replace(" ", "_").replace(".", "_")
                chunk_id = f"{document_id}_chunk_{i}"
                documents.append({
                    "chunk_id": chunk_id,
                    "text": chunk.page_content,
                    "metadata": {
                        "source": file.filename,
                        "chunk_size": self.chunk_size,
                        "chunk_overlap": self.chunk_overlap
                    }
                })
            
            return documents
        except Exception as e:
            print(f"Error processing PDF: {str(e)}")
            return []
