from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os
from .models import User, Course, Major, TestRecord, Account, ChatHistory

# --- DB Configuration ---
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 27017))
DB_USER = os.getenv("DB_USER", "teamB")
DB_PASS = os.getenv("DB_PASS", "teamB123!")
DATABASE_NAME = os.getenv("DATABASE_NAME", "teamB")

# Connection URL
MONGODB_URL = f"mongodb://{DB_HOST}:{DB_PORT}"
# Using authenticated connection as requested
# MONGODB_URL = f"mongodb://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DATABASE_NAME}"

async def init_db():
    """Initialize database connection and Beanie ODM"""
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    await init_beanie(
        database=db,
        document_models=[
            User,
            Course,
            Major,
            TestRecord,
            Account,
            ChatHistory
        ]
    )
    print(f"Connected to MongoDB at {DB_HOST}:{DB_PORT} (DB: {DATABASE_NAME})")
