import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import json
import os
from bson import json_util

async def export_db():
    # Connect to MongoDB
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db_name = "teamB"
    db = client[db_name]
    
    # Directory to save JSON files
    output_dir = "data"
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Exporting database '{db_name}' to '{output_dir}/'...")
    
    # Get all collection names
    collections = await db.list_collection_names()
    
    for collection_name in collections:
        print(f"Exporting collection: {collection_name}...")
        
        # specific query to exclude system collections if any, though usually hidden
        cursor = db[collection_name].find()
        documents = await cursor.to_list(length=None)
        
        # Convert to JSON compatible format (handling ObjectIds, Dates using json_util)
        file_path = os.path.join(output_dir, f"{collection_name}.json")
        
        with open(file_path, "w", encoding="utf-8") as f:
            # json_util.dumps handles BSON types like ObjectId and datetime
            f.write(json_util.dumps(documents, indent=2, ensure_ascii=False))
            
        print(f"  - Saved {len(documents)} documents to {file_path}")
    
    print("Export completed successfully.")

if __name__ == "__main__":
    asyncio.run(export_db())
