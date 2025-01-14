from supabase import create_client, Client
from functools import lru_cache
from app.core.config import get_settings

@lru_cache()
def get_supabase_client() -> Client:
    """Creates and returns a Supabase client instance with caching."""
    settings = get_settings()
    return create_client(settings.NEXT_PUBLIC_SUPABASE_URL, settings.NEXT_PUBLIC_SUPABASE_ANON_KEY)

# Initialize the client when module is imported
supabase = get_supabase_client()
