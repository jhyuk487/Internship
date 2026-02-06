import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_db():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["teamB"]
    
    print("Collections:", await db.list_collection_names())
    
    collections_to_check = ["login_info", "account_info", "users", "students"]
    for coll_name in collections_to_check:
        if coll_name in await db.list_collection_names():
            print(f"\n--- {coll_name} content (first 5) ---")
            cursor = db[coll_name].find().limit(5)
            async for doc in cursor:
                print(doc)

if __name__ == "__main__":
    asyncio.run(check_db())
