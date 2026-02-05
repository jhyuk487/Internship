import json
import os
from typing import Optional, Dict
from app.core.config import settings

class StudentService:
    def __init__(self):
        self.students = []
        self.load_data()

    def load_data(self):
        if os.path.exists(settings.STUDENT_DB_PATH):
            with open(settings.STUDENT_DB_PATH, "r", encoding="utf-8") as f:
                self.students = json.load(f)
        else:
            print("Student DB not found.")

    def authenticate(self, student_id: str, password: str) -> Optional[Dict]:
        for student in self.students:
            if student["student_id"] == student_id and student["password"] == password:
                return student
        return None

    def get_student_info(self, student_id: str) -> Optional[Dict]:
        for student in self.students:
            if student["student_id"] == student_id:
                # Return safe info (exclude password)
                info = student.copy()
                del info["password"]
                return info
        return None

student_service = StudentService()
