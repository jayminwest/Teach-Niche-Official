from fastapi import APIRouter, HTTPException
from app.supabase.client import supabase
from app.stripe.client import stripe

api_router = APIRouter()

@api_router.get("/")
async def read_root():
    return "Hello from the backend!"

@api_router.get("/test-supabase")
async def test_supabase():
    try:
        response = supabase.auth.get_session()
        return {"status": "connected", "message": "Supabase connection successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/test-stripe")
async def test_stripe():
    try:
        # Simple test by retrieving Stripe account details
        stripe.Account.retrieve()
        return {"status": "connected", "message": "Stripe connection successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
