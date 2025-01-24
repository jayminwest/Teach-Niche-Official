import os
from typing import Dict, Any, Optional
from pydantic import BaseModel, EmailStr, Field
from fastapi import HTTPException
from app.supabase.client import get_supabase_client

class AuthResponse(BaseModel):
    user: Dict[str, Any] = Field(default_factory=dict)
    session: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None

class UserProfile(BaseModel):
    id: str
    email: str
    email_confirmed_at: Optional[str]
    created_at: str
    updated_at: str

class SessionInfo(BaseModel):
    access_token: str
    refresh_token: str
    expires_at: int

class VerifySessionResponse(BaseModel):
    user: UserProfile
    session: SessionInfo

def sign_up_with_email(email: EmailStr, password: str) -> AuthResponse:
    """Register a new user using email and password."""
    supabase = get_supabase_client()
    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "email_redirect_to": f"{os.getenv('NEXT_PUBLIC_SITE_URL')}/auth/confirm"
            }
        })
        
        if response.get("error"):
            raise HTTPException(
                status_code=400,
                detail=response['error'].message
            )
            
        return AuthResponse(
            user=response.get('user', {}),
            session=response.get('session', {})
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

def sign_in_with_email(email: str, password: str) -> AuthResponse:
    """Authenticate a user using email and password."""
    supabase = get_supabase_client()
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if response.get("error"):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )
            
        return AuthResponse(
            user=response.get('user', {}),
            session=response.get('session', {})
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

def verify_session(access_token: str) -> VerifySessionResponse:
    """Verify and return session information."""
    supabase = get_supabase_client()
    try:
        response = supabase.auth.get_user(access_token)
        
        if response.get("error"):
            raise HTTPException(
                status_code=401,
                detail="Invalid session"
            )
            
        user = response.user
        return VerifySessionResponse(
            user=UserProfile(
                id=user.id,
                email=user.email,
                email_confirmed_at=user.email_confirmed_at,
                created_at=user.created_at,
                updated_at=user.updated_at
            ),
            session=SessionInfo(
                access_token=access_token,
                refresh_token="",  # Not returned for security
                expires_at=0       # Not returned for security
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

def send_password_reset_email(email: str) -> None:
    """Send a password reset email to the user."""
    supabase = get_supabase_client()
    try:
        response = supabase.auth.reset_password_email(email, {
            "redirect_to": f"{os.getenv('NEXT_PUBLIC_SITE_URL')}/auth/reset-password"
        })
        
        if response.get("error"):
            raise HTTPException(
                status_code=400,
                detail="Failed to send password reset email"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

def verify_email(token: str) -> bool:
    """Verify a user's email address using the verification token."""
    supabase = get_supabase_client()
    try:
        response = supabase.auth.verify_otp({
            "token": token,
            "type": "email"
        })
        
        if response.get("error"):
            raise HTTPException(
                status_code=400,
                detail="Invalid verification token"
            )
            
        return True
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

def update_password(access_token: str, new_password: str) -> None:
    """Update the user's password using a valid access token."""
    supabase = get_supabase_client()
    response = supabase.auth.update_user(access_token, {"password": new_password})
    if response.get("error"):
        raise Exception(f"Password update failed: {response['error']}")

def sign_in_with_google(google_token: str) -> dict:
    """Authenticate a user using Google Sign-In."""
    supabase = get_supabase_client()
    response = supabase.auth.sign_in_with_oauth({
        "provider": "google",
        "access_token": google_token
    })
    if response.get("error"):
        raise Exception(f"Google sign-in failed: {response['error']}")
    return response
