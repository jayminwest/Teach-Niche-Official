"""Authentication utilities for Supabase integration."""

def register_user_with_email(email: str, password: str) -> dict:
    """Sign up a new user with email and password."""
    return {"message": "Signup handled by frontend"}

def authenticate_user_with_email(email: str, password: str) -> dict:
    """Sign in an existing user with email and password."""
    return {"message": "Signin handled by frontend"}

def initiate_password_reset(email: str) -> None:
    """Send a password reset email to the user."""
    pass

def sign_in_with_google(token: str) -> dict:
    """Sign in a user with Google OAuth."""
    return {"message": "Google signin handled by frontend"}
