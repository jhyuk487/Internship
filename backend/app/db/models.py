from typing import Optional, List
from beanie import Document
from pydantic import Field, BaseModel
from datetime import datetime

class Student(Document):
    student_id: str
    password: str
    name: str
    major: str
    gpa: str
    tuition_status: str

    class Settings:
        name = "students"

class ChatMessage(BaseModel):
    """Single chat message"""
    role: str  # "user" or "ai"
    content: str

class ChatHistory(Document):
    """Chat history document for MongoDB"""
    student_id: str
    title: str
    messages: List[ChatMessage] = []
    is_pinned: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "chat_histories"
