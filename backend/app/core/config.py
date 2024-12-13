from pydantic import BaseModel
from functools import lru_cache
from typing import List

class Settings(BaseModel):
    NEXT_PUBLIC_SUPABASE_URL: str
    NEXT_PUBLIC_SUPABASE_ANON_KEY: str
    STRIPE_SECRET_KEY: str
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        from_attributes = True

@lru_cache()
def get_settings() -> Settings:
    import os
    from dotenv import load_dotenv
    load_dotenv()
    
    return Settings(
        NEXT_PUBLIC_SUPABASE_URL=os.getenv("NEXT_PUBLIC_SUPABASE_URL"),
        NEXT_PUBLIC_SUPABASE_ANON_KEY=os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
        STRIPE_SECRET_KEY=os.getenv("STRIPE_SECRET_KEY")
    )
