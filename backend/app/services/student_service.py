from app.database.models import Account, User, GradeRecord
from app.auth.security import verify_password

class StudentService:
    async def authenticate(self, user_id: str, password: str):
        # Find account by user_id (from login_info)
        account = await Account.find_one(Account.user_id == user_id)
        if account and verify_password(password, account.user_password):
            # Fetch profile info from User collection (user_info)
            user_profile = await self.get_student_info(user_id)
            return {
                "id": account.user_id,
                "user_data": user_profile
            }
        return None



    async def get_student_info(self, student_id: str):
        # 1. User 정보 조회
        user = await User.find_one(User.user_id == student_id)
        
        if user:
            user_data = user.dict(exclude={"id"})
            
            # 2. GradeRecord 정보 조회 및 추가
            grades = await GradeRecord.find_one(GradeRecord.user_id == student_id)
            if grades:
                # "academic_records" 키로 성적 정보 추가 (AI가 명확히 인식하도록)
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
            # Retrieve password from Account
            account = await Account.find_one(Account.user_id == student_id)
            if account:
                return "[보안] 비밀번호가 암호화되어 있어 직접 조회할 수 없습니다. 관리자에게 문의하세요."
        return None


student_service = StudentService()
