from fastapi import APIRouter, HTTPException
from typing import List
from beanie import PydanticObjectId
from .models import TestRecord
from .schemas import TestRecordCreate, TestRecordResponse

router = APIRouter()

@router.post("/test", response_model=TestRecordResponse)
async def create_test_record(record: TestRecordCreate):
    """Create a simple record in teamB collection to verify connection."""
    new_record = TestRecord(message=record.message)
    await new_record.insert()
    return new_record

@router.get("/test", response_model=List[TestRecordResponse])
async def get_test_records():
    """Retrieve all records from teamB collection."""
    return await TestRecord.find_all().to_list()

@router.delete("/test/{record_id}")
async def delete_test_record(record_id: PydanticObjectId):
    """Delete a record by ID."""
    record = await TestRecord.get(record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    await record.delete()
    return {"message": "Record deleted successfully"}
