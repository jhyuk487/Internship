from typing import Optional, Dict
from app.db.models import Student

class StudentService:
    def __init__(self):
        # We no longer need to load data from JSON on init
        pass

    async def authenticate(self, student_id: str, password: str) -> Optional[Student]:
        student = await Student.find_one(Student.student_id == student_id, Student.password == password)
        return student

    async def get_student_info(self, student_id: str) -> Optional[Dict]:
        student = await Student.find_one(Student.student_id == student_id)
        if student:
            # Return safe info (beanie document to dict)
            info = student.model_dump()
            del info["password"]
            # Convert ObjectId if necessary, though student_id is the primary identifier for the user
            if "_id" in info:
                info["_id"] = str(info["_id"])
            return info
        return None

student_service = StudentService()
