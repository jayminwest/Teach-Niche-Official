"""
Vimeo API client configuration and management.

This module provides a centralized way to interact with the Vimeo API,
handling authentication and providing a reusable client instance.
"""

from functools import lru_cache
import vimeo
from ..core.config import get_settings

@lru_cache()
def get_vimeo_client() -> vimeo.VimeoClient:
    """
    Get a cached instance of the Vimeo API client.
    
    Returns:
        vimeo.VimeoClient: Authenticated Vimeo API client instance
    """
    settings = get_settings()
    
    return vimeo.VimeoClient(
        token=settings.VIMEO_ACCESS_TOKEN,
        key=settings.VIMEO_CLIENT_ID,
        secret=settings.VIMEO_CLIENT_SECRET
    )
