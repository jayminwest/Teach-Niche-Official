from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.supabase.auth import (
    sign_up_with_email,
    sign_in_with_email,
    send_password_reset_email,
    sign_in_with_google,
)
from app.supabase.client import get_supabase_client

router = APIRouter(prefix="/api")
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token and return current user."""
    supabase = get_supabase_client()
    try:
        user = supabase.auth.get_user(credentials.credentials)
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/")
async def read_root():
    """Root endpoint that returns a welcome message."""
    return {"message": "Welcome to TeachNiche API"}

@router.post("/auth/signup")
async def signup(email: str, password: str):
    try:
        return sign_up_with_email(email, password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/auth/signin")
async def signin(email: str, password: str):
    try:
        return sign_in_with_email(email, password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/auth/reset-password")
async def reset_password(email: str):
    try:
        send_password_reset_email(email)
        return {"message": "Password reset email sent"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/auth/google")
async def google_signin(google_token: str):
    try:
        return sign_in_with_google(google_token)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/protected")
async def protected_route(user = Depends(get_current_user)):
    return {"message": "You are authenticated", "user": user}

@router.get("/health-check")
async def health_check():
    return {"status": "ok"}

@router.get("/test/supabase")
async def test_supabase():
    try:
        # Add actual Supabase test logic here
        return {"status": "ok"}
    except Exception:
        raise HTTPException(status_code=500, detail="Supabase integration test failed")

@router.get("/test/stripe")
async def test_stripe():
    try:
        # Add actual Stripe test logic here
        return {"status": "ok"}
    except Exception:
        raise HTTPException(status_code=500, detail="Stripe integration test failed")
