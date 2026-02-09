import json
import asyncio
import os
from app.database.database import init_db, MONGODB_URL, DATABASE_NAME
from app.database.models import User, Course, Major, Account, GradeRecord
from app.auth.security import get_password_hash

# Path to the data_sets folder (one level up from backend)
DATA_SETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data_sets")

async def seed_data():
    # 1. Initialize DB Connection using the app's own logic
    print(f"Connecting to MongoDB at {MONGODB_URL} (DB: {DATABASE_NAME})...")
    await init_db()

    # 2. File to Model Mapping
    mappings = {
        "user_info.json": User,
        "login_info.json": Account,
        "uni_courses_info.json": Course,
        "uni_majors_info.json": Major,
        "grade_records.json": GradeRecord
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
            print(f"  - Deleting existing records in '{model.Settings.name}'...")
            await model.find_all().delete()
            
            # Insert new data
            if data:
                print(f"  - Inserting {len(data)} records...")
                # Create objects to validate against schema
                objects = []
                for item in data:
                    try:
                        objects.append(model(**item))
                    except Exception as ve:
                        print(f"   [!] Validation error in {filename} for item {item.get('user_id', 'unknown')}: {ve}")
                        continue
                
                if objects:
                    # Specific logic for Account: hash passwords if they look like plain text
                    if model == Account:
                        for obj in objects:
                            if not obj.user_password.startswith("$2b$"):
                                obj.user_password = get_password_hash(obj.user_password)
                    
                    await model.insert_many(objects)
                    print(f" [OK] Successfully synced {len(objects)} records.")
                else:
                    print(f" [!] No valid records to sync for {filename}.")
            else:
                print(f" [OK] File was empty, collection cleared.")
                
        except Exception as e:
            print(f" [X] Error processing {filename}: {e}")

    print("\nDatabase synchronization complete.")

if __name__ == "__main__":
    asyncio.run(seed_data())
