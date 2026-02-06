from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.db.models import UserCredential, ChatHistory

async def init_db():
    # Create Motor client
    print(f"Connecting to MongoDB at: {settings.MONGODB_URL}")
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    
    # Initialize beanie with document models
    await init_beanie(database=client[settings.DATABASE_NAME], document_models=[UserCredential, ChatHistory])
