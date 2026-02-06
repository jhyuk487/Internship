from typing import List
from app.database.models import Course
from app.models.schemas import CourseSearchResponse

class CourseService:
    async def search_courses(self, query: str) -> List[CourseSearchResponse]:
        """Search courses by name (case-insensitive partial match)"""
        # if not query:
        #     return []
        
        filter_criteria = {}
        if query:
            filter_criteria = {"course_name": {"$regex": query, "$options": "i"}}
            
        # Regex search for case-insensitive partial match
        # Limit to 10 results to avoid overloading
        courses = await Course.find(filter_criteria).limit(10).to_list()
        
        return [
            CourseSearchResponse(
                course_name=c.course_name,
                credits=c.credits
            ) for c in courses
        ]

course_service = CourseService()
