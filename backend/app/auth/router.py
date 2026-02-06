from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from .security import create_access_token, verify_token
from app.services.student_service import student_service
from app.models.schemas import Token, TokenData

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

# Login request model for JSON body
class LoginRequest(BaseModel):
    user_id: str
    user_password: str


@router.post("/login", response_model=Token)
async def login(request: LoginRequest):
    """Login endpoint that accepts JSON body"""
    user = await student_service.authenticate(request.user_id, request.user_password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["id"]})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_data": user.get("user_data")
    }

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await student_service.authenticate(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["id"]})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_data": user.get("user_data")
    }



async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    return username

@router.get("/me")
async def get_me(user_id: str = Depends(get_current_user)):
    """Retrieve current user profile using JWT token"""
    user_profile = await student_service.get_student_info(user_id)
    if not user_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found",
        )
    return {"user_data": user_profile}


