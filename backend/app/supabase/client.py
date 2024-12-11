from supabase import create_client
from app.core.config import get_settings

settings = get_settings()

def get_supabase_client():
    return create_client(
        settings.NEXT_PUBLIC_SUPABASE_URL,
        settings.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

supabase = get_supabase_client()
