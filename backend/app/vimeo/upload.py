"""
Handles video upload operations for Vimeo integration.

This module manages secure video uploads to Vimeo with proper privacy settings
and metadata management.
"""

import os
from typing import Dict, Optional
from fastapi import HTTPException
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
        print(f"Initializing upload for: {title}")
        print(f"Using privacy settings: {privacy}")
        
        # Verify file exists and is readable
        if not os.path.exists(file_path):
            raise FileNotFoundError("File not found")
            
        print(f"File size: {os.path.getsize(file_path)} bytes")
        
        # Attempt upload
        try:
            video_data = client.upload(
                file_path,
                data={
                    'name': title,
                    'description': description or '',
                    'privacy': privacy
                }
            )
        except Exception as upload_error:
            print(f"Upload error details: {str(upload_error)}")
            print(f"Error type: {type(upload_error).__name__}")
            raise
            
        print("Upload completed successfully!")
        print(f"Video data received: {video_data}")
        
        # Extract video ID from the URI string
        video_id = video_data.split('/')[-1] if isinstance(video_data, str) else ''
        
        return {
            "vimeo_id": video_data.uri.split("/")[-1],
            "uri": video_data.uri,
            "url": video_data.link,
            "title": video_data.name
        }
        
    except FileNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Vimeo API error: {str(e)}")
