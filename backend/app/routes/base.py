from fastapi import APIRouter, HTTPException
from app.supabase.client import supabase

router = APIRouter()

@router.get("/")
async def read_root():
    return "Hello from the backend!"

@router.get("/test-supabase")
async def test_supabase():
    try:
        response = supabase.auth.get_session()
        return {"status": "connected", "message": "Supabase connection successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
