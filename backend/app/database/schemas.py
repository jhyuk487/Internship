from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from beanie import PydanticObjectId
from datetime import datetime

# --- Test Record Schemas ---
class TestRecordCreate(BaseModel):
    message: str

class TestRecordResponse(BaseModel):
    id: PydanticObjectId = Field(alias="_id")
    message: str
    created_at: datetime
    
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )

# --- Student Schemas ---
class StudentBase(BaseModel):
    student_id: str
    name: str
    nationality: Optional[str] = None
    gender: Optional[str] = None
    major_name: Optional[str] = None

class StudentCreate(StudentBase):
    password: str

class StudentResponse(StudentBase):
    id: PydanticObjectId = Field(alias="_id")
    
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )
