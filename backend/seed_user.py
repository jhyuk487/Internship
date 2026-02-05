import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.database.models import Account

# DB Config (Local)
MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "teamB"

async def seed_user():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    await init_beanie(database=db, document_models=[Account])

    # Check if user exists
    existing = await Account.find_one(Account.student_id == "1001")
    if existing:
        print("User 1001 already exists. Updating password...")
        existing.password = "password123"
        await existing.save()
    else:
        print("Creating user 1001...")
        user = Account(student_id="1001", password="password123")
        await user.insert()
    
    print("Seed complete.")

if __name__ == "__main__":
    asyncio.run(seed_user())
