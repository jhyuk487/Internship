from app.database.models import Account, User, GradeRecord
from app.auth.security import verify_password, get_password_hash

class StudentService:
    async def authenticate(self, user_id: str, password: str):
        # Find account by user_id (from login_info)
        account = await Account.find_one(Account.user_id == user_id)
        if not account:
            return None

        stored = account.user_password or ""
        is_hashed = stored.startswith("$2")

        if is_hashed:
            valid = verify_password(password, stored)
        else:
            # Legacy/plaintext fallback: validate and upgrade to bcrypt
            valid = password == stored
            if valid:
                account.user_password = get_password_hash(password)
                await account.save()

        if valid:
            # Fetch profile info from User collection (user_info)
            user_profile = await self.get_student_info(user_id)
            return {
                "id": account.user_id,
                "user_data": user_profile
            }
        return None



    async def get_student_info(self, student_id: str):
        # 1. User ?•ë³´ ì¡°íšŒ
        user = await User.find_one(User.user_id == student_id)
        
        if user:
            user_data = user.dict(exclude={"id"})
            
            # 2. GradeRecord ?•ë³´ ì¡°íšŒ ë°?ì¶”ê?
            grades = await GradeRecord.find_one(GradeRecord.user_id == student_id)
            if grades:
                # "academic_records" ?¤ë¡œ ?±ì  ?•ë³´ ì¶”ê? (AIê°€ ëª…í™•???¸ì‹?˜ë„ë¡?
                user_data["academic_records"] = grades.dict(exclude={"id", "user_id"})
                
            return user_data
            
        return None

    async def find_password(self, student_id: str, email: str):
        # Clean input
        student_id = student_id.strip()
        email = email.strip().lower()

        # Verify student exists and email matches (case-insensitive)
        user = await User.find_one(User.user_id == student_id)
        if user and user.email.lower() == email:
            account = await Account.find_one(Account.user_id == student_id)
            if account:
                return True
        return None

    async def reset_password(self, student_id: str, email: str, new_password: str):
        # Clean input
        student_id = student_id.strip()
        email = email.strip().lower()
        new_password = new_password.strip()

        if not new_password:
            return None

        # Verify student exists and email matches (case-insensitive)
        user = await User.find_one(User.user_id == student_id)
        if user and user.email.lower() == email:
            # Retrieve password from Account
            account = await Account.find_one(Account.user_id == student_id)
            if account:
                account.user_password = get_password_hash(new_password)
                await account.save()
                return True
        return None


student_service = StudentService()






