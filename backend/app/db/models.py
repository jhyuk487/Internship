from typing import Optional, List
from beanie import Document
from pydantic import Field, BaseModel
from datetime import datetime

class UserCredential(Document):
    """User credentials for login - matches user_credentials collection"""
    student_id: str
    password: str
    role: str = "student"

    class Settings:
        name = "user_credentials"
    
    class Config:
        populate_by_name = True

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
