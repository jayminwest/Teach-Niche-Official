from pydantic import BaseModel, Field
from functools import lru_cache
from typing import List

class Settings(BaseModel):
    NEXT_PUBLIC_SUPABASE_URL: str = Field(default="http://localhost:8000")
    NEXT_PUBLIC_SUPABASE_ANON_KEY: str = Field(default="test-key")
    STRIPE_SECRET_KEY: str = Field(default="test-key")
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        from_attributes = True

@lru_cache()
def get_settings() -> Settings:
    import os
    from dotenv import load_dotenv
    
    # Try to load from .env file
    load_dotenv()
    
    # Use environment variables if available, otherwise use defaults
    return Settings(
        NEXT_PUBLIC_SUPABASE_URL=os.getenv("NEXT_PUBLIC_SUPABASE_URL", "http://localhost:8000"),
        NEXT_PUBLIC_SUPABASE_ANON_KEY=os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-key"),
        STRIPE_SECRET_KEY=os.getenv("STRIPE_SECRET_KEY", "test-key")
    )
