from google import genai
from app.core.config import settings
from functools import lru_cache

class GeminiService:
    def __init__(self):
        if not settings.GOOGLE_API_KEY:
            print("WARNING: GOOGLE_API_KEY is not set.")
        
        # New SDK Initialization
        self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        self.model_id = 'gemma-3-27b-it' 
        print(f"DEBUG: Loaded GeminiService with model: {self.model_id}")


    async def generate_response(self, user_query: str, context: str = "") -> str:
        """
        Generates a response using Gemma 3, moving instructions into the prompt context.
        """
        prompt = self._prepare_prompt(user_query, context)
        
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt
            )
            return response.text
        except Exception as e:
            return f"Error communicating with AI: {str(e)}"

    async def stream_chat_response(self, user_query: str, context: str = ""):
        """
        Generates a streaming response using Gemma 3.
        """
        prompt = self._prepare_prompt(user_query, context)
        
        try:
            for chunk in self.client.models.generate_content_stream(
                model=self.model_id,
                contents=prompt
            ):
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            yield f"\n[Error: {str(e)}]"

    def _prepare_prompt(self, user_query: str, context: str = "") -> str:
        system_instruction = """You are a helpful AI assistant for UCSI University. 
        Your goal is to assist students with accurate information about the university.

        Format your responses in Markdown. Use headings, lists, and code blocks when appropriate.
        Do not wrap the entire response in a single code block.
        
        If context is provided, use it to answer the question.
        If the answer is not in the context, use your general knowledge but mention that this might be general info.
        If the question is about personal student data (grades, etc) and no context is provided, ask them to log in or say you need access.
        """
        
        return f"""{system_instruction}

Context:
{context}

User Query: {user_query}
"""

    async def detect_intent(self, user_query: str) -> str:
        """
        Classifies the intent of the question: 'general' vs 'personal'.
        """
        prompt = f"""Classify the following query into one of these categories: 
        1. 'general' (University info, campus, facilities, programs)
        2. 'personal' (Grades, fees, schedule, login, my account)
        
        Query: "{user_query}"
        
        Return ONLY the category name.
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt
            )
            return response.text.strip().lower()
        except Exception as e:
            print(f"Intent detection error: {e}")
            return "general" # Default

@lru_cache()
def get_gemini_service():
    return GeminiService()
