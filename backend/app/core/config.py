import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    PROJECT_NAME: str = "UCSI University Chatbot"
    VERSION: str = "2.0.0"
    DESCRIPTION: str = "AI Chatbot for UCSI University students (Free & Local-First)"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_key_for_dev_only")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # External APIs
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    

    # Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    DOCS_DIR: str = os.path.join(DATA_DIR, "docs")
    FAISS_INDEX_DIR: str = os.path.join(DATA_DIR, "faiss_index")

settings = Settings()
