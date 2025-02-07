import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi import HTTPException
from app.vimeo.client import get_vimeo_client
from app.vimeo.upload import upload_video
from app.core.config import get_settings

@pytest.mark.asyncio
@patch('app.vimeo.client.vimeo.VimeoClient')
async def test_vimeo_client_initialization(mock_vimeo):
    """Test Vimeo client is properly configured with credentials"""
    settings = get_settings()
    
    # Call the client getter
    client = get_vimeo_client()
    
    mock_vimeo.assert_called_once_with(
        token=settings.VIMEO_ACCESS_TOKEN,
        key=settings.VIMEO_CLIENT_ID,
        secret=settings.VIMEO_CLIENT_SECRET,
        api_version='3.4'
    )
    assert client == mock_vimeo.return_value

@pytest.mark.asyncio
@patch('app.vimeo.upload.get_vimeo_client')
@patch('os.path.exists')
async def test_successful_video_upload(mock_exists, mock_client):
    """Test successful video upload flow"""
    mock_client.return_value.upload = AsyncMock(
        return_value=MagicMock(
            uri='/videos/12345',
            link='https://vimeo.com/12345',
            status_code=201
        )
    )
    mock_client.return_value.upload.return_value.name = 'test_video'
    mock_exists.return_value = True
    
    result = await upload_video(
        file_path="backend/tests/media/fixtures/test_video.mp4",
        title="Test Video",
        description="Test Description",
        privacy={"view": "disable"}
    )
    
    mock_client.return_value.upload.assert_called_once_with(
        "backend/tests/media/fixtures/test_video.mp4",
        data={
            'name': 'Test Video', 
            'description': 'Test Description',
            'privacy': {'view': 'disable'}
        }
    )
    assert result == {
        "vimeo_id": "12345",
        "uri": "/videos/12345",
        "url": "https://vimeo.com/12345",
        "title": "test_video"
    }

@pytest.mark.asyncio
@patch('app.vimeo.upload.get_vimeo_client')
async def test_upload_invalid_file(mock_client):
    """Test handling of invalid file paths"""
    mock_client.return_value.upload = AsyncMock(side_effect=FileNotFoundError)
    
    with pytest.raises(HTTPException) as exc:
        await upload_video("missing.mp4", "Test")
        
    assert exc.value.status_code == 400
    assert "Video file not found" in exc.value.detail

@pytest.mark.asyncio
@patch('app.vimeo.upload.get_vimeo_client')
@patch('app.vimeo.upload.os.path.exists')
@patch('app.vimeo.upload.os.path.getsize')
async def test_upload_api_error(mock_getsize, mock_exists, mock_client):
    """Test handling of Vimeo API errors"""
    mock_client.return_value.upload = AsyncMock(
        side_effect=Exception("API Error")
    )
    mock_exists.return_value = True  # File exists check passes
    mock_getsize.return_value = 1024  # Mock valid file size
    
    with pytest.raises(HTTPException) as exc:
        await upload_video("valid.mp4", "Test")
        
    assert exc.value.status_code == 502
    assert "Vimeo API error: API Error" in exc.value.detail
