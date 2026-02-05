from app.database.models import Account, Student

class StudentService:
    async def authenticate(self, student_id: str, password: str):
        # Find account by student_id
        account = await Account.find_one(Account.student_id == student_id)
        if account and account.password == password:
            # If successful, we might want to return profile info from Student collection
            # But for now, returning the account object (converted to dict) is enough for the token
            return {"student_id": account.student_id}
        return None

    async def get_student_info(self, student_id: str):
        student = await Student.find_one(Student.student_id == student_id)
        if student:
            return student.dict()
        return None

student_service = StudentService()
