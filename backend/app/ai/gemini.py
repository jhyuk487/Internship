from google import genai
from app.core.config import settings
from functools import lru_cache

class GeminiService:
    def __init__(self):
        # if not settings.GOOGLE_API_KEY:
        #     print("WARNING: GOOGLE_API_KEY is not set.")
        
        # # New SDK Initialization
        # self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        # self.model_id = 'gemini-2.0-flash' # Updated to latest model
        self.client = None
        self.model_id = None


    async def generate_response(self, user_query: str, context: str = "") -> str:
        """
        Generates a response using Gemini, optionally using retrieved context (RAG).
        """
        system_instruction = """You are a helpful AI assistant for UCSI University. 
        Your goal is to assist students with accurate information about the university.
        
        If context is provided, use it to answer the question.
        If the answer is not in the context, using your general knowledge but mention that this might be general info.
        If the question is about personal student data (grades, etc) and no context is provided, ask them to log in or say you need access.
        """
        
        prompt = f"""Context:
        {context}
        
        User Query: {user_query}
        """
        
        try:
            # New SDK usage
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt,
                config={
                    'system_instruction': system_instruction
                }
            )
            return response.text
        except Exception as e:
            return f"Error communicating with AI: {str(e)}"

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
