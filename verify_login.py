import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import sys
import os

# Add backend to path to import app
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.database.models import Account, User, Course, Major, TestRecord
from app.services.student_service import student_service

async def verify():
    # Initialize DB (copying logic from backend/app/database/database.py)
    DATABASE_NAME = "teamB"
    MONGODB_URL = "mongodb://localhost:27017"
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    await init_beanie(
        database=db,
        document_models=[User, Course, Major, TestRecord, Account]
    )
    print("Connected to DB")

    # Try to find a sample account to verify the collection name and field
    sample_account = await Account.find_one()
    if sample_account:
        print(f"Found account: {sample_account.dict()}")
        
        # Test authentication with the new schema
        auth_result = await student_service.authenticate(sample_account.id, sample_account.password)
        if auth_result:
            print(f"Authentication Successful: {auth_result}")
        else:
            print("Authentication Failed")
    else:
        print("No accounts found in 'login_info' collection. Please ensure you have seeded the database.")

if __name__ == "__main__":
    asyncio.run(verify())
