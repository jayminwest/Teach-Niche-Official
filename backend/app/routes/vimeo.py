"""
Vimeo API route handlers.

This module provides FastAPI route handlers for Vimeo-related operations
like video uploads and metadata management.
"""

from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Optional

from ..vimeo.upload import upload_video
from ..vimeo.client import get_vimeo_client

router = APIRouter(
    prefix="/vimeo",
    tags=["vimeo"]
)

@router.post("/upload")
async def handle_video_upload(
    file_path: str = Body(...),
    title: str = Body(...),
    description: Optional[str] = Body(None),
    privacy: Optional[Dict] = Body(None)
) -> Dict:
    """
    Handle video upload requests.
    
    Args:
        file_path: Path to video file
        title: Video title
        description: Optional video description
        privacy: Optional privacy settings
        
    Returns:
        Dict containing upload result and video metadata
    """
    try:
        result = await upload_video(
            file_path=file_path,
            title=title,
            description=description,
            privacy=privacy
        )
        
        if result['status'] == 'error':
            raise HTTPException(
                status_code=400,
                detail=f"Upload failed: {result['message']}"
            )
            
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Upload error: {str(e)}"
        )

@router.get("/me")
async def get_account_info() -> Dict:
    """
    Get information about the authenticated Vimeo account.
    
    Returns:
        Dict containing account information
    """
    try:
        client = get_vimeo_client()
        response = client.get('/me')
        return response.json()
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get account info: {str(e)}"
        )
