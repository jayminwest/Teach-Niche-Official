"""Supabase API Routes Module.

This module provides FastAPI routes for interacting with Supabase services including:
- User authentication (signup, signin, password reset)
- Database CRUD operations
- Database migrations

The routes handle requests and responses between the frontend and Supabase backend services,
providing a standardized interface for common Supabase operations.

All routes follow RESTful conventions and return consistent JSON responses.
Error handling is implemented to provide meaningful error messages to clients.
"""
from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any

from app.supabase.auth import (
    sign_up_with_email,
    sign_in_with_email,
    send_password_reset_email
)
from app.supabase.api import (
    create_record as create_db_record,
    read_records as read_db_records,
    update_record as update_db_record,
    delete_record as delete_db_record
)
from app.supabase.migrations import apply_migration

# Initialize FastAPI router for Supabase-related endpoints
router = APIRouter(
    prefix="/api/supabase",
    tags=["supabase"],
    responses={404: {"description": "Not found"}},
)

@router.post("/models")
async def create_model() -> Dict[str, str]:
    """Create a new database model (placeholder implementation).
    
    This endpoint currently serves as a placeholder for future model creation functionality.
    It will be expanded to handle actual model creation and validation logic.
    
    Returns:
        Dict[str, str]: A dictionary containing the operation status.
        
    Example:
        >>> response = await create_model()
        >>> print(response)
        {'status': 'model created successfully'}
    """
    return {"status": "model created successfully"}

@router.post("/migrations")
async def apply_database_migration(section: str = Body(..., embed=True)) -> Dict[str, str]:
    """Apply database migrations for a specific section.
    
    This endpoint triggers the migration process for a specified database section.
    It handles the migration execution and error reporting.
    
    Args:
        section (str): The database section to apply migrations to.
        
    Returns:
        Dict[str, str]: A dictionary containing the migration status.
        
    Raises:
        HTTPException: If the migration fails, returns a 500 error with details.
        
    Example:
        >>> response = await apply_database_migration(section="users")
        >>> print(response)
        {'status': 'migration applied successfully'}
    """
    try:
        apply_migration(section)
        return {"status": "migration applied successfully"}
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Migration failed for section {section}: {str(error)}"
        )

@router.post("/auth/register")
async def register_user(email: str = Body(..., embed=True), password: str = Body(..., embed=True)) -> Dict[str, Any]:
    """Register a new user with email and password.
    
    This endpoint handles user registration by creating a new account in Supabase Auth.
    It validates the credentials and returns the authentication response.
    
    Args:
        email (str): The user's email address.
        password (str): The user's password.
        
    Returns:
        Dict[str, Any]: The authentication response from Supabase.
        
    Raises:
        HTTPException: If registration fails, returns a 400 error with details.
        
    Example:
        >>> response = await register_user(email="user@example.com", password="securepassword")
        >>> print(response)
        {'user': {...}, 'session': {...}}
    """
    try:
        return sign_up_with_email(email, password)
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=f"Registration failed: {str(error)}"
        )

@router.post("/auth/login")
async def authenticate_user(email: str = Body(..., embed=True), password: str = Body(..., embed=True)) -> Dict[str, Any]:
    """Authenticate a user with email and password.
    
    This endpoint handles user authentication by verifying credentials against Supabase Auth.
    It returns the authentication session if successful.
    
    Args:
        email (str): The user's email address.
        password (str): The user's password.
        
    Returns:
        Dict[str, Any]: The authentication response from Supabase.
        
    Raises:
        HTTPException: If authentication fails, returns a 400 error with details.
        
    Example:
        >>> response = await authenticate_user(email="user@example.com", password="securepassword")
        >>> print(response)
        {'user': {...}, 'session': {...}}
    """
    try:
        return sign_in_with_email(email, password)
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=f"Authentication failed: {str(error)}"
        )

@router.post("/auth/password-reset")
async def initiate_password_reset(email: str = Body(..., embed=True)) -> Dict[str, str]:
    """Initiate a password reset process for a user.
    
    This endpoint sends a password reset email to the specified address.
    It handles the request and returns a confirmation message.
    
    Args:
        email (str): The user's email address.
        
    Returns:
        Dict[str, str]: A confirmation message.
        
    Raises:
        HTTPException: If the request fails, returns a 400 error with details.
        
    Example:
        >>> response = await initiate_password_reset(email="user@example.com")
        >>> print(response)
        {'message': 'Password reset email sent'}
    """
    try:
        send_password_reset_email(email)
        return {"message": "Password reset email sent"}
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=f"Password reset failed: {str(error)}"
        )

@router.post("/create_record")
async def create_record_endpoint(table: str = Body(...), data: dict = Body(...)):
    """Endpoint to create a record in the database."""
    try:
        response = create_db_record(table, data)
        return {"id": response.get("id")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/read_records")
async def read_records_endpoint(table: str):
    """Endpoint to read records from the database."""
    try:
        response = read_db_records(table)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/update_record")
async def update_record_endpoint(table: str = Body(...), record_id: int = Body(...), data: dict = Body(...)):
    """Endpoint to update a record in the database."""
    try:
        response = update_db_record(table, record_id, data)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete_record")
async def delete_record_endpoint(table: str = Body(...), record_id: int = Body(...)):
    """Endpoint to delete a record from the database."""
    try:
        response = delete_db_record(table, record_id)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
