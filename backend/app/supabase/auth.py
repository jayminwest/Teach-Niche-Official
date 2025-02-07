"""Authentication utilities for Supabase integration."""
from app.supabase.client import get_supabase_client

def register_user_with_email(email: str, password: str) -> dict:
    """Sign up a new user with email and password."""
    client = get_supabase_client()
    try:
        response = client.auth.sign_up({
            "email": email,
            "password": password
        })
        return response.dict()
    except Exception as e:
        raise Exception(f"Registration failed: {str(e)}")

def authenticate_user_with_email(email: str, password: str) -> dict:
    """Sign in an existing user with email and password."""
    client = get_supabase_client()
    try:
        response = client.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return response.dict()
    except Exception as e:
        raise Exception(f"Authentication failed: {str(e)}")

def initiate_password_reset(email: str) -> None:
    """Send a password reset email to the user."""
    client = get_supabase_client()
    try:
        response = client.auth.reset_password_email(email)
        return response.dict()
    except Exception as e:
        raise Exception(f"Password reset failed: {str(e)}")

def sign_in_with_google(token: str) -> dict:
    """Sign in a user with Google OAuth."""
    client = get_supabase_client()
    try:
        response = client.auth.sign_in_with_oauth({
            "provider": "google",
            "access_token": token
        })
        return response.dict()
    except Exception as e:
        raise Exception(f"Google sign in failed: {str(e)}")
