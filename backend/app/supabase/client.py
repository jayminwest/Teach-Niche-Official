"""Supabase Client Initialization and Management Module.

This module provides functions for initializing and managing the Supabase client connection.
It handles environment variable loading, client creation, and implements lazy loading with
caching for efficient resource management.

The module follows the singleton pattern to ensure a single instance of the Supabase client
is used throughout the application.
"""

from supabase import create_client
from functools import lru_cache
import os

# Initialize the Supabase client instance
supabase = None

def _initialize():
    """Initialize the Supabase client instance."""
    global supabase
    if supabase is None:
        supabase = get_supabase_client()

@lru_cache()
def get_supabase_client():
    """Creates and returns a Supabase client instance with caching.
    
    Retrieves Supabase connection credentials from environment variables and initializes
    a client instance. The client is cached using lru_cache for efficient reuse.
    
    Returns:
        supabase.Client: Initialized Supabase client instance
        
    Raises:
        ValueError: If required environment variables are not set
    """
    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    
    if not supabase_url or not supabase_key:
        raise ValueError(
            "Supabase environment variables are not set. "
            "Please ensure NEXT_PUBLIC_SUPABASE_URL and "
            "NEXT_PUBLIC_SUPABASE_ANON_KEY are configured."
        )
        
    return create_client(supabase_url, supabase_key)

# Initialize the client when module is imported
_initialize()
