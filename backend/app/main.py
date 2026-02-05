from contextlib import asynccontextmanager
from app.db.connection import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB on startup
    await init_db()
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

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Mount Static Files
app.mount("/static", StaticFiles(directory="../frontend"), name="static")

@app.get("/", tags=["UI"])
async def root():
    return FileResponse("../frontend/index.html")

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}

from app.api import auth, chat

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
