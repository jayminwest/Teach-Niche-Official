from fastapi import APIRouter
from .onboarding import router as onboarding_router
from .payments import router as payments_router
from .payouts import router as payouts_router
from .webhooks import router as webhooks_router

# Combine all stripe routers into one
router = APIRouter(prefix="/stripe")
router.include_router(onboarding_router)
router.include_router(payments_router)
router.include_router(payouts_router)
router.include_router(webhooks_router)
