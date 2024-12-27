from fastapi import APIRouter, HTTPException, Body
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

router = APIRouter()

@router.post("/create_model")
async def create_model_endpoint():
    """Endpoint to create a model (placeholder logic)."""
    return {"status": "model created successfully"}

@router.post("/apply_migration")
async def apply_migration_endpoint(section: str = Body(...)):
    """Endpoint to apply migrations to the database."""
    try:
        apply_migration(section)
        return {"status": "migration applied successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/signup")
async def signup_endpoint(email: str = Body(...), password: str = Body(...)):
    """Endpoint for user sign-up using email and password."""
    try:
        response = sign_up_with_email(email, password)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/signin")
async def signin_endpoint(email: str = Body(...), password: str = Body(...)):
    """Endpoint for user sign-in using email and password."""
    try:
        response = sign_in_with_email(email, password)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/reset_password")
async def reset_password_endpoint(email: str = Body(...)):
    """Endpoint to send a password reset email."""
    try:
        send_password_reset_email(email)
        return {"message": "Password reset email sent"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

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
