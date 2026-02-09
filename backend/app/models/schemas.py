from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from typing import Dict

class Token(BaseModel):
    access_token: str
    token_type: str
    user_data: Optional[dict] = None

class TokenData(BaseModel):
    username: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[str] = [] # List of filenames or context sources

class DocumentIngestRequest(BaseModel):
    filename: str
    content: str

class CourseSearchResponse(BaseModel):
    course_name: str
    credits: int

# Chat History Schemas
class ChatMessageSchema(BaseModel):
    role: str
    content: str
    
class SaveChatRequest(BaseModel):
    title: str
    messages: List[ChatMessageSchema]

class UpdateChatRequest(BaseModel):
    title: Optional[str] = None
    is_pinned: Optional[bool] = None
    messages: Optional[List[ChatMessageSchema]] = None

class ChatHistoryResponse(BaseModel):
    id: str
    title: str
    messages: List[ChatMessageSchema]
    is_pinned: bool
    created_at: datetime

class ChatListResponse(BaseModel):
    chats: List[ChatHistoryResponse]

# Grade Records
class GradeCourseSchema(BaseModel):
    course_code: Optional[str] = None
    course_name: Optional[str] = None
    credits: int
    grade: str
    is_major: Optional[bool] = False

class GradeRecordUpdate(BaseModel):
    terms: Dict[str, List[GradeCourseSchema]]

class GradeRecordResponse(BaseModel):
    user_id: str
    terms: Dict[str, List[GradeCourseSchema]]
    updated_at: datetime

class ChatFeedbackRequest(BaseModel):
    user_id: Optional[str] = None
    chat_id: Optional[str] = None
    message_index: Optional[int] = None
    user_query: str
    ai_response: str
    rating: str  # "like" or "dislike"
    feedback_text: Optional[str] = None
