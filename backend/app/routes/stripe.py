from fastapi import APIRouter, HTTPException, Body, Request
from app.stripe.onboarding import create_account, create_account_session
from app.stripe.dashboard import dashboard_session_handler
from app.stripe.payments import create_checkout_session
from app.stripe.payouts import setup_payouts
from app.stripe.webhooks import webhook_handler

router = APIRouter()

@router.post("/account")
async def create_account_endpoint():
    """Endpoint to create a Stripe account."""
    try:
        account = create_account()
        return {"account": account}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/account_session")
async def create_account_session_endpoint(account: str = Body(...)):
    """Endpoint to create a Stripe account session."""
    try:
        session = create_account_session(account)
        return {"client_secret": session}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/dashboard_session")
async def dashboard_session_endpoint(account: str = Body(...)):
    """Endpoint to create a Stripe dashboard session."""
    try:
        session = dashboard_session_handler(account)
        return {"client_secret": session}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create_checkout_session")
async def create_checkout_session_endpoint(account: str = Body(...), line_items: list = Body(...)):
    """Endpoint to create a Stripe checkout session."""
    try:
        session = create_checkout_session(account, line_items)
        return session
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/setup_payouts")
async def setup_payouts_endpoint(account: str = Body(...), interval: str = Body(...), delay_days: int = Body(...), weekly_anchor: str = Body(...)):
    """Endpoint to setup Stripe payouts."""
    try:
        status = setup_payouts(account, interval, delay_days, weekly_anchor)
        return {"status": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def webhook_endpoint(request: Request):
    """Endpoint to handle Stripe webhooks."""
    try:
        payload = await request.body()
        sig_header = request.headers.get('Stripe-Signature')
        response = webhook_handler(payload, sig_header)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
