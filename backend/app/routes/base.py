from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.supabase.auth import (
    sign_up_with_email,
    sign_in_with_email,
    send_password_reset_email,
    sign_in_with_google,
)
from app.supabase.client import get_supabase_client

api_router = APIRouter()
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token and return current user."""
    supabase = get_supabase_client()
    try:
        user = supabase.auth.get_user(credentials.credentials)
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@api_router.get("/")
async def read_root():
    return "Hello from the backend!"

@api_router.post("/auth/signup")
async def signup(email: str, password: str):
    try:
        return sign_up_with_email(email, password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/auth/signin")
async def signin(email: str, password: str):
    try:
        return sign_in_with_email(email, password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/auth/reset-password")
async def reset_password(email: str):
    try:
        send_password_reset_email(email)
        return {"message": "Password reset email sent"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/auth/google")
async def google_signin(google_token: str):
    try:
        return sign_in_with_google(google_token)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/protected")
async def protected_route(user = Depends(get_current_user)):
    return {"message": "You are authenticated", "user": user}
