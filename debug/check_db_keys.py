import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_db():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["teamB"]
    
    colls = await db.list_collection_names()
    print(f"Available Collections: {colls}")
    
    if "login_info" in colls:
        doc = await db["login_info"].find_one()
        if doc:
            print(f"\nExample doc in 'login_info': {doc}")
            print(f"Keys: {list(doc.keys())}")
        else:
            print("\n'login_info' is empty.")
    
    if "account_info" in colls:
        doc = await db["account_info"].find_one()
        if doc:
            print(f"\nExample doc in 'account_info': {doc}")
            print(f"Keys: {list(doc.keys())}")

if __name__ == "__main__":
    asyncio.run(check_db())
