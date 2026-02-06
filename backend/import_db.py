import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import json
import os
from bson import json_util

async def import_db():
    # Connect to MongoDB
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db_name = "teamB"  # Default DB name for the project
    db = client[db_name]
    
    # Directory where JSON files are located
    input_dir = "data"
    
    if not os.path.exists(input_dir):
        print(f"Error: Data directory '{input_dir}' not found.")
        return
    
    print(f"Importing data into '{db_name}' from '{input_dir}/'...")
    
    # Get all JSON files in the directory
    files = [f for f in os.listdir(input_dir) if f.endswith('.json')]
    
    if not files:
        print("No JSON files found to import.")
        return

    for filename in files:
        collection_name = filename.replace('.json', '')
        file_path = os.path.join(input_dir, filename)
        
        print(f"Importing collection: {collection_name}...")
        
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json_util.loads(f.read())
                
            if data:
                # Optional: Drop existing collection to ensure clean state
                await db[collection_name].drop()
                
                # Insert data
                await db[collection_name].insert_many(data)
                print(f"  - Imported {len(data)} documents into '{collection_name}'")
            else:
                print(f"  - No data found in {filename}, skipping.")
                
        except Exception as e:
            print(f"  - Error importing {filename}: {e}")
    
    print("Import completed successfully.")

if __name__ == "__main__":
    asyncio.run(import_db())
