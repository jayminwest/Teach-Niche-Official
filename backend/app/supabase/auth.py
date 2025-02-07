"""Authentication utilities for Supabase integration."""

def sign_up_with_email(email: str, password: str) -> dict:
    """Sign up a new user with email and password."""
    return {"message": "Signup handled by frontend"}

def sign_in_with_email(email: str, password: str) -> dict:
    """Sign in an existing user with email and password."""
    return {"message": "Signin handled by frontend"}

def send_password_reset_email(email: str) -> None:
    """Send a password reset email to the user."""
    pass

def sign_in_with_google(token: str) -> dict:
    """Sign in a user with Google OAuth."""
    return {"message": "Google signin handled by frontend"}
