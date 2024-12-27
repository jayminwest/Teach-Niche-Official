from supabase import create_client
from functools import lru_cache
import os

@lru_cache()
def get_supabase_client():
    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    
    if not supabase_url or not supabase_key:
        raise ValueError("Supabase environment variables are not set")
        
    return create_client(supabase_url, supabase_key)

# Instead of initializing immediately, create a lazy-loaded client
supabase = None

def initialize_supabase():
    global supabase
    if supabase is None:
        supabase = get_supabase_client()
    return supabase
