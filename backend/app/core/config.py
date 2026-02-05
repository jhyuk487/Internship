import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    PROJECT_NAME: str = "UCSI University Chatbot"
    VERSION: str = "2.0.0"
    DESCRIPTON: str = "AI Chatbot for UCSI University students (Free & Local-First)"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_key_for_dev_only")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # External APIs
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    
    # MongoDB Configuration
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: int = int(os.getenv("DB_PORT", 27017))
    DB_USER: str = os.getenv("DB_USER", "")
    DB_PASS: str = os.getenv("DB_PASS", "")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "teamB")
    
    @property
    def MONGODB_URL(self) -> str:
        if self.DB_USER and self.DB_PASS:
            return f"mongodb://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DATABASE_NAME}?authSource=admin"
        return f"mongodb://{self.DB_HOST}:{self.DB_PORT}/{self.DATABASE_NAME}"

    # Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    DOCS_DIR: str = os.path.join(DATA_DIR, "docs")
    FAISS_INDEX_DIR: str = os.path.join(DATA_DIR, "faiss_index")
    STUDENT_DB_PATH: str = os.path.join(DATA_DIR, "student_db.json")

settings = Settings()
