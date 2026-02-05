import json
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os

# Import models from app
from app.db.models import Student
from app.core.config import settings

async def migrate():
    print("Starting migration...")
    
    # Create Motor client
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    
    # Initialize beanie
    await init_beanie(database=client[settings.DATABASE_NAME], document_models=[Student])
    
    # Check if students collection is empty
    count = await Student.count()
    if count > 0:
        print(f"Collection 'students' already has {count} documents. Skipping migration.")
        return

    # Path to student_db.json
    json_path = settings.STUDENT_DB_PATH
    if not os.path.exists(json_path):
        print(f"JSON file not found at: {json_path}")
        return

    # Load JSON
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Insert documents
    students_to_add = []
    for item in data:
        student = Student(**item)
        students_to_add.append(student)
    
    if students_to_add:
        await Student.insert_many(students_to_add)
        print(f"Successfully migrated {len(students_to_add)} students.")
    else:
        print("No students found in JSON.")

if __name__ == "__main__":
    asyncio.run(migrate())
