from supabase import create_client, Client
from functools import lru_cache
from app.core.config import get_settings

@lru_cache()
def get_supabase_client() -> Client:
    """Creates and returns a Supabase client instance with caching."""
    settings = get_settings()
    from supabase import ClientOptions
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY, ClientOptions(
        auto_refresh_token=False,
        persist_session=False,
        detect_session_in_url=False
    ))

# Initialize the client when module is imported
try:
    supabase = get_supabase_client()
    # Test connection
    supabase.auth.admin.list_users()
except Exception as e:
    raise RuntimeError(f"Failed to initialize Supabase client: {str(e)}")
