from typing import List, Optional
from beanie import Document, Link
from pydantic import Field, BaseModel
from datetime import datetime

class TestRecord(Document):
    """
    Verification model for 'teamB' collection request.
    Stores simple information to verify DB connection.
    """
    message: str
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "teamB"

class Account(Document):
    """
    Model for user authentication (login).
    Collection: account_info
    """
    student_id: str
    password: str 

    class Settings:
        name = "account_info"

class Faculty(Document):
    faculty_id: str
    name: str
    campus: Optional[str] = None

    class Settings:
        name = "faculties"

class Course(Document):
    course_id: str
    course_code: str
    course_name: str
    faculty_id: str
    credit_hours: int

    class Settings:
        name = "courses"

class Student(Document):
    student_id: str
    password: str  # Kept for backward compatibility if needed, but Account should be primary for auth
    name: str
    nationality: Optional[str] = None
    gender: Optional[str] = None
    major_id: Optional[str] = None
    major_name: Optional[str] = None
    intake: Optional[str] = None
    dob: Optional[str] = None
    faculty: Optional[str] = None
    
    class Settings:
        name = "students"
