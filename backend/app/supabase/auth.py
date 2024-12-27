"""
auth.py

This module handles authentication operations with Supabase.
"""

from app.supabase.client import supabase

def sign_up_with_email(email: str, password: str) -> dict:
    """
    Registers a new user using email and password.

    Args:
        email (str): The user's email address.
        password (str): The user's password.

    Returns:
        dict: Response from Supabase containing user details.

    Raises:
        Exception: If sign-up fails.
    """
    response = supabase.auth.sign_up({'email': email, 'password': password})
    if response.get('error'):
        raise Exception(f"Sign-up failed: {response['error']}")
    return response

def sign_in_with_email(email: str, password: str) -> dict:
    """
    Authenticates a user using email and password.

    Args:
        email (str): The user's email address.
        password (str): The user's password.

    Returns:
        dict: Session information if successful.

    Raises:
        Exception: If sign-in fails.
    """
    response = supabase.auth.sign_in_with_password({'email': email, 'password': password})
    if response.get('error'):
        raise Exception(f"Sign-in failed: {response['error']}")
    return response

def send_password_reset_email(email: str) -> None:
    """
    Sends a password reset email to the user.

    Args:
        email (str): The user's email address.

    Raises:
        Exception: If sending reset email fails.
    """
    response = supabase.auth.reset_password_email(email)
    if response.get('error'):
        raise Exception(f"Password reset email failed: {response['error']}")

def update_password(access_token: str, new_password: str) -> None:
    """
    Updates the user's password using a valid access token.

    Args:
        access_token (str): Valid access token.
        new_password (str): New password to set.

    Raises:
        Exception: If password update fails.
    """
    response = supabase.auth.update_user(access_token, {'password': new_password})
    if response.get('error'):
        raise Exception(f"Password update failed: {response['error']}")

def sign_in_with_google(google_token: str) -> dict:
    """
    Authenticates a user using Google Sign-In.

    Args:
        google_token (str): Valid Google OAuth token.

    Returns:
        dict: Session information if successful.

    Raises:
        Exception: If Google sign-in fails.
    """
    response = supabase.auth.sign_in_with_oauth({
        'provider': 'google',
        'access_token': google_token
    })
    if response.get('error'):
        raise Exception(f"Google sign-in failed: {response['error']}")
    return response
