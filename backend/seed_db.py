import json
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.database.models import User, Course, Major, Account
from app.core.config import settings

# Path to the data_sets folder (one level up from backend)
DATA_SETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data_sets")

async def seed_data():
    # 1. Initialize DB Connection
    print(f"Connecting to MongoDB at {settings.MONGODB_URL}...")
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    await init_beanie(
        database=db,
        document_models=[User, Course, Major, Account]
    )

    # 2. File to Model Mapping
    mappings = {
        "user_info.json": User,
        "login_info.json": Account,
        "uni_courses_info.json": Course,
        "uni_majors_info.json": Major
    }

    print("\nStarting database synchronization...")

    for filename, model in mappings.items():
        file_path = os.path.join(DATA_SETS_DIR, filename)
        
        if not os.path.exists(file_path):
            print(f" [!] Skipping {filename}: File not found.")
            continue

        print(f" [*] Processing {filename} -> collection '{model.Settings.name}'...")
        
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                
            # If it's a single object, wrap in a list
            if isinstance(data, dict):
                data = [data]

            # Clear existing data
            await model.find_all().delete()
            
            # Insert new data
            if data:
                # Use model.insert_many or loop depending on Beanie version/need
                # For safety and validation, we'll create objects first
                objects = [model(**item) for item in data]
                await model.insert_many(objects)
                print(f" [OK] Successfully synced {len(data)} records.")
            else:
                print(f" [OK] File was empty, collection cleared.")
                
        except Exception as e:
            print(f" [X] Error processing {filename}: {e}")

    print("\nDatabase synchronization complete.")

if __name__ == "__main__":
    asyncio.run(seed_data())
