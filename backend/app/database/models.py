from typing import List, Optional, Any
from beanie import Document
from pydantic import Field, BaseModel
from datetime import datetime
from typing import Dict

class User(Document):
    user_id: str
    name: str
    major: str
    grade: int
    credits: int
    email: str
    phone: str
    address: str
    profile_picture: Optional[str] = None

    class Settings:
        name = "user_info"

class Account(Document):
    user_id: str = Field(alias="user_id")
    user_password: str

    class Settings:
        name = "login_info"



class SectionInfo(BaseModel):
    professor_name: str
    schedule: str
    location: str
    section_number: int

class Course(Document):
    course_unique_id: str
    course_name: str
    credits: int
    major_id: str
    sections: List[SectionInfo] = []
    prerequisite_code: Optional[str] = None

    class Settings:
        name = "uni_courses_info"

class Major(Document):
    major_id: str
    major_name: str
    campus_location: str

    class Settings:
        name = "uni_majors_info"

class TestRecord(Document):
    message: str
    
    class Settings:
        name = "teamB"

class ChatMessage(BaseModel):
    """Single chat message"""
    role: str  # "user" or "ai"
    content: str

class ChatHistory(Document):
    """Chat history document for MongoDB"""
    user_id: str  # Changed from student_id to match Account model
    title: str
    messages: List[ChatMessage] = []
    is_pinned: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Settings:
        name = "chat_histories"

class GradeCourseEntry(BaseModel):
    course_code: Optional[str] = None
    course_name: Optional[str] = None
    credits: int
    grade: str
    is_major: Optional[bool] = False

class GradeRecord(Document):
    user_id: str
    terms: Dict[str, List[GradeCourseEntry]] = {}
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "grade_records"
