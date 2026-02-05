import os
from typing import List
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.config import settings

class VectorService:
    def __init__(self):
        # Initialize Embeddings (Local, Free)
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.vector_store = None
        self.load_index()

    def load_index(self):
        """Loads FAISS index from disk if exists"""
        if os.path.exists(settings.FAISS_INDEX_DIR) and os.path.exists(os.path.join(settings.FAISS_INDEX_DIR, "index.faiss")):
            try:
                self.vector_store = FAISS.load_local(
                    settings.FAISS_INDEX_DIR, 
                    self.embeddings,
                    allow_dangerous_deserialization=True 
                )
                print("FAISS index loaded successfully.")
            except Exception as e:
                print(f"Error loading FAISS index: {e}")
        else:
            print("No existing FAISS index found. Starting empty.")

    def ingest_documents(self):
        """Reads files from data/docs and rebuilds the index"""
        if not os.path.exists(settings.DOCS_DIR):
            os.makedirs(settings.DOCS_DIR)
            
        # Load Text Files
        loader = DirectoryLoader(settings.DOCS_DIR, glob="**/*.txt", loader_cls=TextLoader)
        documents = loader.load()
        
        if not documents:
            print("No documents found in data/docs to ingest.")
            return

        # Split Text
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_documents(documents)
        
        # Create Vector Store
        print(f"Creating embeddings for {len(chunks)} chunks...")
        self.vector_store = FAISS.from_documents(chunks, self.embeddings)
        
        # Save to Disk
        if not os.path.exists(settings.FAISS_INDEX_DIR):
            os.makedirs(settings.FAISS_INDEX_DIR)
        
        self.vector_store.save_local(settings.FAISS_INDEX_DIR)
        print("FAISS index saved successfully.")

    def search(self, query: str, k: int = 3) -> List[str]:
        """Returns list of relevant text chunks"""
        if not self.vector_store:
            return []
        
        docs = self.vector_store.similarity_search(query, k=k)
        return [doc.page_content for doc in docs]

vector_service = VectorService()
