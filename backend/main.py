"""Main entry point for the FastAPI application.

This module serves as the central configuration and initialization point for the backend API.
It handles the following key responsibilities:

1. Application Initialization:
   - Creates and configures the FastAPI application instance
   - Sets up CORS middleware for cross-origin requests
   - Registers all API routers with appropriate prefixes

2. Configuration Management:
   - Loads application settings from environment variables
   - Configures CORS origins based on settings

3. Development Server:
   - Provides a local development server using Uvicorn
   - Configures host binding and port settings

The application integrates with:
- Base API routes (/api/v1)
- Supabase authentication and database services (/api/v1/supabase)
- Stripe payment processing services (/api/v1/stripe)

Environment Variables:
    CORS_ORIGINS: Comma-separated list of allowed origins for CORS
    APP_ENV: Application environment (development/production)
    API_VERSION: Version of the API (default: 1.0.0)
"""

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.routes.base import router as base_router
from app.routes.supabase import router as supabase_router
from app.stripe.onboarding import router as stripe_onboarding_router
from app.stripe.payments import router as stripe_payments_router 
from app.stripe.dashboard import router as stripe_dashboard_router
from app.stripe.payouts import router as stripe_payouts_router
from app.stripe.webhooks import router as stripe_webhooks_router
from app.stripe.compliance import router as stripe_compliance_router
from app.routes.lessons import router as lessons_router
from app.routes.vimeo import router as vimeo_router

# Initialize application settings
APP_SETTINGS = get_settings()

def create_fastapi_app() -> FastAPI:
    """Creates and configures the FastAPI application instance with all necessary middleware and routes.

    This function performs the following operations:
    1. Initializes a new FastAPI instance with metadata (title, description, version)
    2. Configures CORS middleware with settings from environment variables
    3. Registers all API routers with their respective prefixes
    4. Returns the fully configured application instance

    Returns:
        FastAPI: A fully configured FastAPI application instance ready for use with:
            - CORS middleware enabled
            - All API routers registered
            - Metadata configured

    Example:
        >>> app = create_fastapi_app()
        >>> isinstance(app, FastAPI)
        True
    """
    app = FastAPI(
        title="Teach Nice Backend",
        description="Backend API for the Teach Niche website",
        version="1.0.0"
    )

    # Configure CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=APP_SETTINGS.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Define API version prefix
    api_v1_prefix = "/api/v1"
    
    # Register all API routers with versioned prefix
    app.include_router(supabase_router)
    app.include_router(base_router, prefix="/api")
    
    # Stripe routers with consistent prefix
    
    # Register lessons router first to avoid route conflicts
    app.include_router(lessons_router, prefix=f"{api_v1_prefix}", tags=["lessons"])
    app.include_router(vimeo_router, prefix=f"{api_v1_prefix}/vimeo", tags=["vimeo"])
    app.include_router(stripe_onboarding_router, prefix=f"{api_v1_prefix}/stripe", tags=["stripe"])
    app.include_router(stripe_payments_router, prefix=f"{api_v1_prefix}/stripe", tags=["stripe"])
    app.include_router(stripe_dashboard_router, prefix=f"{api_v1_prefix}/stripe", tags=["stripe"])
    app.include_router(stripe_payouts_router, prefix=f"{api_v1_prefix}/stripe", tags=["stripe"])
    app.include_router(stripe_webhooks_router, prefix=f"{api_v1_prefix}/stripe", tags=["stripe"])
    app.include_router(stripe_compliance_router, prefix=f"{api_v1_prefix}/stripe", tags=["stripe"])

    return app

# Initialize the FastAPI application
app = create_fastapi_app()

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

def start_uvicorn_server() -> None:
    """Starts the Uvicorn development server with default configuration.

    This function is specifically designed for local development environments.
    It should not be used in production deployments. The server is configured to:
    - Bind to all network interfaces (0.0.0.0)
    - Listen on port 8000
    - Use the configured FastAPI application instance

    Note:
        For production deployments, use a proper WSGI server like Gunicorn
        with Uvicorn workers instead of this development server.

    Environment Variables:
        UVICORN_HOST: Overrides default host binding (optional)
        UVICORN_PORT: Overrides default port (optional)

    Example:
        >>> start_uvicorn_server()  # Starts server on 0.0.0.0:8000
    """
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    start_uvicorn_server()
