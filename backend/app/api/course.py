from fastapi import APIRouter, Depends
from typing import List
from app.services.course_service import course_service
from app.models.schemas import CourseSearchResponse

router = APIRouter()

@router.get("/search", response_model=List[CourseSearchResponse])
async def search_courses(query: str):
    """Search for courses by name"""
    return await course_service.search_courses(query)
