from typing import List, Optional
from datetime import datetime
from app.database.models import ChatHistory, ChatMessage
from beanie import PydanticObjectId

class ChatHistoryService:
    """Service for managing chat history in MongoDB"""
    
    async def save_chat(self, user_id: str, title: str, messages: List[dict]) -> ChatHistory:
        """Save a new chat history"""
        chat_messages = [ChatMessage(**msg) for msg in messages]
        now = datetime.utcnow()
        chat = ChatHistory(
            user_id=user_id,
            title=title,
            messages=chat_messages,
            created_at=now,
            updated_at=now
        )
        await chat.insert()
        return chat
    
    async def get_user_chats(self, user_id: str) -> List[ChatHistory]:
        """Get all chats for a user, sorted by pinned first, then newest"""
        chats = await ChatHistory.find(
            ChatHistory.user_id == user_id
        ).sort([("is_pinned", -1), ("updated_at", -1), ("created_at", -1)]).to_list()
        return chats
    
    async def get_chat_by_id(self, chat_id: str, user_id: str) -> Optional[ChatHistory]:
        """Get a specific chat by ID (with ownership check)"""
        chat = await ChatHistory.get(PydanticObjectId(chat_id))
        if chat and chat.user_id == user_id:
            return chat
        return None
    
    async def update_chat(self, chat_id: str, user_id: str, 
                          title: Optional[str] = None, 
                          is_pinned: Optional[bool] = None,
                          messages: Optional[List[dict]] = None) -> Optional[ChatHistory]:
        """Update a chat (title, pin status, or messages)"""
        chat = await self.get_chat_by_id(chat_id, user_id)
        if not chat:
            return None
        changed = False
        if title is not None:
            chat.title = title
            changed = True
        if is_pinned is not None:
            chat.is_pinned = is_pinned
            changed = True
        if messages is not None:
            chat.messages = [ChatMessage(**msg) for msg in messages]
            changed = True
        if changed:
            chat.updated_at = datetime.utcnow()
        await chat.save()
        return chat
    
    async def delete_chat(self, chat_id: str, user_id: str) -> bool:
        """Delete a chat (with ownership check)"""
        chat = await self.get_chat_by_id(chat_id, user_id)
        if not chat:
            return False
        await chat.delete()
        return True

chat_history_service = ChatHistoryService()
