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
            # Exclude MongoDB internal ID (PydanticObjectId) to avoid serialization error
            return user.dict(exclude={"id"})
        return None

    async def find_password(self, student_id: str, email: str):
        # Clean input
        student_id = student_id.strip()
        email = email.strip().lower()

        # Verify student exists and email matches (case-insensitive)
        user = await User.find_one(User.user_id == student_id)
        if user and user.email.lower() == email:
            # Retrieve password from Account
            account = await Account.find_one(Account.user_id == student_id)
            if account:
                return account.user_password
        return None


student_service = StudentService()
