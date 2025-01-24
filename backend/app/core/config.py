"""
Configuration management for the application.

This module handles all environment configuration and settings using Pydantic's BaseModel.
It provides a centralized way to manage and access environment variables with type safety
and default values. The settings are cached using lru_cache for efficient access.

Key Features:
- Type-safe environment variable handling
- Default values for local development
- Caching for improved performance
- Support for CORS origins configuration
"""

from pydantic import BaseModel, Field
from functools import lru_cache
from typing import List

class Settings(BaseModel):
    """
    Application settings model that defines and validates environment variables.

    Attributes:
        NEXT_PUBLIC_SUPABASE_URL (str): URL for Supabase backend service
        NEXT_PUBLIC_SUPABASE_ANON_KEY (str): Anonymous key for Supabase authentication
        STRIPE_SECRET_KEY (str): Secret key for Stripe API integration
        CORS_ORIGINS (List[str]): List of allowed CORS origins

    Config:
        from_attributes: Enables ORM mode for Pydantic model
    """
    SUPABASE_URL: str = Field(
        default="http://localhost:8000",
        description="Supabase project URL (must start with http:// or https://)"
    )
    SUPABASE_SERVICE_KEY: str = Field(
        default="test-service-key",
        description="Supabase service role key (starts with 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')",
        min_length=20
    )
    SUPABASE_ANON_KEY: str = Field(
        default="test-key",
        description="Supabase anonymous key (for client-side use only)"
    )
    STRIPE_SECRET_KEY: str = Field(default="test-key")
    STRIPE_WEBHOOK_SECRET: str = Field(default="test-webhook-secret")
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        from_attributes = True

@lru_cache()
def get_settings() -> Settings:
    """
    Retrieve application settings with caching for improved performance.

    This function loads environment variables from .env file if present,
    falling back to default values if not found. The settings are cached
    using lru_cache to prevent repeated environment variable lookups.

    Returns:
        Settings: An instance of Settings class containing all configuration values

    Example:
        >>> settings = get_settings()
        >>> print(settings.NEXT_PUBLIC_SUPABASE_URL)
        'http://localhost:8000'
    """
    import os
    from dotenv import load_dotenv
    
    # Try to load from .env file
    load_dotenv()
    
    # Use environment variables if available, otherwise use defaults
    return Settings(
        SUPABASE_URL=os.getenv("SUPABASE_URL", os.getenv("NEXT_PUBLIC_SUPABASE_URL", "http://localhost:8000")),
        SUPABASE_SERVICE_KEY=os.getenv("SUPABASE_SERVICE_KEY", "test-service-key"),
        SUPABASE_ANON_KEY=os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-key"),
        STRIPE_SECRET_KEY=os.getenv("STRIPE_SECRET_KEY", "test-key")
    )
