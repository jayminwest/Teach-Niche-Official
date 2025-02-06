"""
Handles video upload operations for Vimeo integration.

This module manages secure video uploads to Vimeo with proper privacy settings
and metadata management.
"""

from typing import Dict, Optional
from .client import get_vimeo_client

async def upload_video(
    file_path: str,
    title: str,
    description: Optional[str] = None,
    privacy: Dict = None
) -> Dict:
    """
    Upload a video file to Vimeo with specified settings.
    
    Args:
        file_path: Path to video file
        title: Video title
        description: Optional video description
        privacy: Optional privacy settings dict
        
    Returns:
        Dict containing video metadata including Vimeo video ID
    """
    client = get_vimeo_client()
    
    # Default to private videos
    if privacy is None:
        privacy = {
            'view': 'disable',  # Private video
            'embed': 'private'  # Private embedding
        }
    
    try:
        # Initialize upload
        video_data = client.upload(
            file_path,
            data={
                'name': title,
                'description': description,
                'privacy': privacy
            }
        )
        
        return {
            'video_id': video_data.get('uri', '').split('/')[-1],
            'player_embed_url': video_data.get('player_embed_url'),
            'status': 'success'
        }
        
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }
