from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

from app.core.config import settings
from app.auth import router as auth_router
from app.ai import router as ai_router
from app.database import router as db_router
from app.api import course as course_router
from app.api import grade_records as grade_records_router
from app.database.database import init_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Files
app.mount("/static", StaticFiles(directory="../frontend"), name="static")

@app.get("/", tags=["UI"])
async def root():
    return FileResponse("../frontend/index.html")

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(ai_router, prefix="/chat", tags=["Chat"])
app.include_router(db_router, prefix="/db", tags=["Database Verification"])
app.include_router(course_router.router, prefix="/courses", tags=["Courses"])
app.include_router(grade_records_router.router, prefix="/grades", tags=["Grades"])

@app.on_event("startup")
async def start_db():
    await init_db()

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
