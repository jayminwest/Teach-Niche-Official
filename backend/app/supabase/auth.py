from app.supabase.client import get_supabase_client

def sign_up_with_email(email: str, password: str) -> dict:
    """Register a new user using email and password."""
    supabase = get_supabase_client()
    response = supabase.auth.sign_up({"email": email, "password": password})
    if response.get("error"):
        raise Exception(f"Sign-up failed: {response['error']}")
    return response

def sign_in_with_email(email: str, password: str) -> dict:
    """Authenticate a user using email and password."""
    supabase = get_supabase_client()
    response = supabase.auth.sign_in_with_password({"email": email, "password": password})
    if response.get("error"):
        raise Exception(f"Sign-in failed: {response['error']}")
    return response

def send_password_reset_email(email: str) -> None:
    """Send a password reset email to the user."""
    supabase = get_supabase_client()
    response = supabase.auth.reset_password_email(email)
    if response.get("error"):
        raise Exception(f"Password reset email failed: {response['error']}")

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
