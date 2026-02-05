from typing import Optional
from beanie import Document
from pydantic import Field

class Student(Document):
    student_id: str
    password: str
    name: str
    major: str
    gpa: str
    tuition_status: str

    class Settings:
        name = "students"
