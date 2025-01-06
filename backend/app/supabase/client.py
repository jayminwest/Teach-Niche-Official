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

# Global variable for singleton Supabase client instance
_SUPABASE_CLIENT = None

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

def initialize_supabase():
    """Initializes and returns the global Supabase client instance.
    
    Implements lazy loading pattern to initialize the Supabase client only when needed.
    Ensures a single instance is maintained throughout the application lifecycle.
    
    Returns:
        supabase.Client: Initialized Supabase client instance
    """
    global _SUPABASE_CLIENT
    
    if _SUPABASE_CLIENT is None:
        _SUPABASE_CLIENT = get_supabase_client()
        
    return _SUPABASE_CLIENT
