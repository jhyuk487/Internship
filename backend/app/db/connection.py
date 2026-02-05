from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.db.models import Student
import os
import json

async def init_db():
    # Create Motor client
    print(f"Connecting to MongoDB at: {settings.MONGODB_URL}")
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    
    # Initialize beanie with the Student document class and a database
    await init_beanie(database=client[settings.DATABASE_NAME], document_models=[Student])
    
    # Optional: Initial migration from JSON
    try:
        count = await Student.count()
        if count == 0 and os.path.exists(settings.STUDENT_DB_PATH):
            print("Importing initial student data from JSON...")
            with open(settings.STUDENT_DB_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
            students = [Student(**item) for item in data]
            if students:
                await Student.insert_many(students)
                print(f"Successfully imported {len(students)} students.")
    except Exception as e:
        print(f"Migration error during init_db: {e}")
