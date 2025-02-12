"""
Vimeo API client configuration and management.

This module provides a centralized way to interact with the Vimeo API,
handling authentication and providing a reusable client instance.
"""

from functools import lru_cache
import pyvimeo
from ..core.config import get_settings

@lru_cache()
def get_vimeo_client() -> pyvimeo.VimeoClient:
    """
    Get a cached instance of the Vimeo API client.
    
    Returns:
        pyvimeo.VimeoClient: Authenticated Vimeo API client instance
    """
    settings = get_settings()
    
    return pyvimeo.VimeoClient(
        token=settings.VIMEO_ACCESS_TOKEN,
        key=settings.VIMEO_CLIENT_ID,
        secret=settings.VIMEO_CLIENT_SECRET,
        api_version='3.4'  # Use latest stable API version
    )
