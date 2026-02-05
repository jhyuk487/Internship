from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

from app.core.config import settings
from app.db.connection import init_db
from app.api import auth, chat

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB on startup
    try:
        await init_db()
    except Exception as e:
        print(f"DB Initialization failed: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTON,
    version=settings.VERSION,
    lifespan=lifespan
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
# Assuming uvicorn runs from the 'backend' directory
app.mount("/static", StaticFiles(directory="../frontend"), name="static")

@app.get("/", tags=["UI"])
async def root():
    return FileResponse("../frontend/index.html")

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
