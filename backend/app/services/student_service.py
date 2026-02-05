from app.database.models import Account, User

class StudentService:
    async def authenticate(self, user_id: str, password: str):
        # Find account by user_id (from login_info)
        account = await Account.find_one(Account.user_id == user_id)
        if account and account.user_password == password:
            # Fetch profile info from User collection (user_info)
            user_profile = await self.get_student_info(user_id)
            return {
                "id": account.user_id,
                "user_data": user_profile
            }
        return None



    async def get_student_info(self, student_id: str):
        # Find user by user_id (from user_info)
        user = await User.find_one(User.user_id == student_id)
        if user:
            return user.dict()
        return None

student_service = StudentService()
