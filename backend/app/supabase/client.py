from supabase import create_client, Client
from functools import lru_cache
from app.core.config import get_settings
from typing import Optional

# Use a singleton pattern with lazy initialization
_supabase_client: Optional[Client] = None

@lru_cache()
def get_supabase_client() -> Client:
    """Creates and returns a Supabase client instance with caching."""
    global _supabase_client
    
    if _supabase_client is not None:
        return _supabase_client
        
    settings = get_settings()
    
    # Validate settings
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        raise ValueError("Supabase URL and Service Key must be configured")
    
    if not settings.SUPABASE_URL.startswith(('http://', 'https://')):
        raise ValueError("Supabase URL must start with http:// or https://")
    
    if len(settings.SUPABASE_SERVICE_KEY) < 20:  # Basic length check
        raise ValueError("Invalid Supabase Service Key format")
    
    from supabase import ClientOptions
    try:
        _supabase_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_KEY,
            ClientOptions(
                auto_refresh_token=False,
                persist_session=False
            )
        )
        # Test connection with a lightweight operation
        _supabase_client.auth.get_session()
        return _supabase_client
    except Exception as e:
        raise RuntimeError(f"Failed to initialize Supabase client: {str(e)}")

def get_supabase() -> Client:
    """Lazy initialization of Supabase client."""
    return get_supabase_client()

# Create a default client instance for direct import
supabase = get_supabase()
