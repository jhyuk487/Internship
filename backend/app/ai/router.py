from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks, HTTPException, status
from fastapi.responses import StreamingResponse
from datetime import datetime
from typing import Optional, List
from app.models.schemas import (
    ChatRequest, ChatResponse, DocumentIngestRequest,
    SaveChatRequest, UpdateChatRequest, ChatHistoryResponse, ChatListResponse, ChatMessageSchema,
    ChatFeedbackRequest
)
from .gemini import get_gemini_service, GeminiService
from .vector import vector_service
from app.services.student_service import student_service
from app.services.chat_service import chat_history_service
# Correct auth import for ehobin architecture
from app.auth.router import get_current_user
from app.auth.security import verify_token
from app.database.models import ChatFeedback
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()

@router.post("/feedback")
async def save_feedback(request: ChatFeedbackRequest):
    """Save or update user feedback for AI response quality"""
    # Try to find existing feedback for this specific message in this chat
    existing = await ChatFeedback.find_one(
        ChatFeedback.chat_id == request.chat_id,
        ChatFeedback.message_index == request.message_index,
        ChatFeedback.user_id == request.user_id
    )

    if existing:
        existing.rating = request.rating
        existing.feedback_text = request.feedback_text
        existing.created_at = datetime.utcnow()
        await existing.save()
        return {"status": "success", "message": "Feedback updated"}
    
    # Otherwise, create a new record
    feedback = ChatFeedback(
        user_id=request.user_id,
        chat_id=request.chat_id,
        message_index=request.message_index,
        user_query=request.user_query,
        ai_response=request.ai_response,
        rating=request.rating,
        feedback_text=request.feedback_text
    )
    await feedback.insert()
    return {"status": "success", "message": "Feedback saved"}

oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="auth/token", auto_error=False)

@router.post("/stream")
async def chat_stream_endpoint(
    request: ChatRequest, 
    token: Optional[str] = Depends(oauth2_scheme_optional),
    gemini_service: GeminiService = Depends(get_gemini_service)
):
    try:
        user_id = request.user_id
        if token and not user_id:
            try:
                payload = verify_token(token)
                user_id = payload.get("sub")
            except:
                pass

        # 1. Intent Detection
        intent = await gemini_service.detect_intent(request.message)
        
        context = ""
        if intent == "personal":
            if not user_id or user_id == "guest":
                async def guest_error():
                    yield "This appears to be a personal question. Please log in to access your information."
                return StreamingResponse(guest_error(), media_type="text/plain")
            
            student_info = await student_service.get_student_info(user_id)
            context = f"Student Information: {str(student_info)}" if student_info else "Student record not found."
        else:
            retrieved_docs = vector_service.search(request.message)
            context = "\n\n".join(retrieved_docs) if retrieved_docs else "No specific documents found."

        # 2. Return StreamingResponse
        return StreamingResponse(
            gemini_service.stream_chat_response(request.message, context),
            media_type="text/plain"
        )
    except Exception as e:
        async def internal_error():
            yield f"Error: {str(e)}"
        return StreamingResponse(internal_error(), media_type="text/plain")

@router.post("", response_model=ChatResponse)
@router.post("/ask", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest, 
    token: Optional[str] = Depends(oauth2_scheme_optional),
    gemini_service: GeminiService = Depends(get_gemini_service)
):
    try:
        user_id = request.user_id
        if token and not user_id:
            try:
                payload = verify_token(token)
                user_id = payload.get("sub")
            except:
                pass # Invalid token, treat as guest

        # 1. Intent Detection
        intent = await gemini_service.detect_intent(request.message)
        print(f"Detected Intent: {intent}")

        context = ""
        sources = []

        # 2. Handle Intent
        if intent == "personal":
            if not user_id or user_id == "guest":
                return ChatResponse(response="This appears to be a personal question. Please log in to access your information.")
            
            student_info = await student_service.get_student_info(user_id)
            if student_info:
                context = f"Student Information: {str(student_info)}"
            else:
                context = "Student record not found."
                
        else: # General
            # RAG Search
            retrieved_docs = vector_service.search(request.message)
            if retrieved_docs:
                context = "\n\n".join(retrieved_docs)
                sources = ["Vector Knowledge Base"]
            else:
                context = "No specific documents found in knowledge base."

        # 3. Generate Response
        response_text = await gemini_service.generate_response(request.message, context)
        
        return ChatResponse(response=response_text, sources=sources)
    except Exception as e:
        print(f"Error in chat_endpoint: {e}")
        return ChatResponse(response=f"Sorry, I am having trouble connecting. Error: {str(e)}", sources=[])

@router.post("/ingest")
async def ingest_documents(background_tasks: BackgroundTasks):
    """Triggers vector DB update"""
    background_tasks.add_task(vector_service.ingest_documents)
    return {"status": "Ingestion started in background"}

# ===== Chat History Endpoints =====

@router.get("/history", response_model=ChatListResponse)
async def get_chat_history(current_user: str = Depends(get_current_user)):
    """Get all chat history for the logged-in user"""
    chats = await chat_history_service.get_user_chats(current_user)
    return ChatListResponse(chats=[
        ChatHistoryResponse(
            id=str(chat.id),
            title=chat.title,
            messages=[ChatMessageSchema(role=m.role, content=m.content) for m in chat.messages],
            is_pinned=chat.is_pinned,
            created_at=chat.created_at,
            updated_at=chat.updated_at or chat.created_at
        ) for chat in chats
    ])

@router.post("/history", response_model=ChatHistoryResponse)
async def save_chat_history(
    request: SaveChatRequest,
    current_user: str = Depends(get_current_user)
):
    """Save a new chat history"""
    messages = [{"role": m.role, "content": m.content} for m in request.messages]
    chat = await chat_history_service.save_chat(current_user, request.title, messages)
    return ChatHistoryResponse(
        id=str(chat.id),
        title=chat.title,
        messages=[ChatMessageSchema(role=m.role, content=m.content) for m in chat.messages],
        is_pinned=chat.is_pinned,
        created_at=chat.created_at,
        updated_at=chat.updated_at or chat.created_at
    )

@router.get("/history/{chat_id}", response_model=ChatHistoryResponse)
async def get_chat_by_id(
    chat_id: str,
    current_user: str = Depends(get_current_user)
):
    """Get a specific chat by ID"""
    chat = await chat_history_service.get_chat_by_id(chat_id, current_user)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return ChatHistoryResponse(
        id=str(chat.id),
        title=chat.title,
        messages=[ChatMessageSchema(role=m.role, content=m.content) for m in chat.messages],
        is_pinned=chat.is_pinned,
        created_at=chat.created_at,
        updated_at=chat.updated_at or chat.created_at
    )

@router.put("/history/{chat_id}", response_model=ChatHistoryResponse)
async def update_chat(
    chat_id: str,
    request: UpdateChatRequest,
    current_user: str = Depends(get_current_user)
):
    """Update a chat (title, pin status, or messages)"""
    messages = None
    if request.messages:
        messages = [{"role": m.role, "content": m.content} for m in request.messages]
    
    chat = await chat_history_service.update_chat(
        chat_id, current_user, 
        title=request.title, 
        is_pinned=request.is_pinned,
        messages=messages
    )
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return ChatHistoryResponse(
        id=str(chat.id),
        title=chat.title,
        messages=[ChatMessageSchema(role=m.role, content=m.content) for m in chat.messages],
        is_pinned=chat.is_pinned,
        created_at=chat.created_at,
        updated_at=chat.updated_at or chat.created_at
    )

@router.delete("/history/{chat_id}")
async def delete_chat(
    chat_id: str,
    current_user: str = Depends(get_current_user)
):
    """Delete a chat"""
    success = await chat_history_service.delete_chat(chat_id, current_user)
    if not success:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {"status": "deleted"}
