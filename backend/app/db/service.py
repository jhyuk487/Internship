from typing import Optional, Dict
from app.db.models import UserCredential

class UserService:
    def __init__(self):
        pass

    async def authenticate(self, student_id: str, password: str) -> Optional[UserCredential]:
        """Authenticate user by student_id and password"""
        # In user_credentials, _id is the student_id
        user = await UserCredential.find_one(
            UserCredential.student_id == student_id, 
            UserCredential.password == password
        )
        return user

    async def get_student_info(self, student_id: str) -> Optional[Dict]:
        """Get user info by student_id"""
        user = await UserCredential.find_one(UserCredential.student_id == student_id)
        if user:
            return {
                "student_id": user.student_id,
                "role": user.role
            }
        return None

student_service = UserService()
