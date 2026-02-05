from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks
from typing import Optional
from app.models.schemas import ChatRequest, ChatResponse, DocumentIngestRequest
from app.ai.gemini_service import get_gemini_service, GeminiService
from app.ai.vector_service import vector_service
from app.db.service import student_service
from app.api.auth import get_current_user, oauth2_scheme
from app.core.security import verify_token

router = APIRouter()

# Redefining to support optional auth properly
from fastapi.security import OAuth2PasswordBearer
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="auth/token", auto_error=False)

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
