import asyncio
import os
import sys
import subprocess
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent.parent / 'backend'
sys.path.append(str(backend_dir))

# Add the backend directory to Python path
backend_dir = Path(__file__).parent.parent / 'backend'
sys.path.append(str(backend_dir))

try:
    import pyvimeo
except ImportError:
    print("PyVimeo package not found. Installing...")
    subprocess.run(["pip", "install", "PyVimeo"], check=True)
    import pyvimeo

from app.vimeo.client import get_vimeo_client
from app.vimeo.upload import upload_video

def create_test_mp4(filepath: Path, duration_secs: int = 5):
    """
    Creates a minimal valid MP4 file for testing.
    Uses ffmpeg to create a test video with color bars.
    
    Args:
        filepath: Where to save the test MP4
        duration_secs: Length of test video in seconds
    """
    try:
        # Create color bars video using ffmpeg
        cmd = [
            'ffmpeg',
            '-f', 'lavfi',  # Use lavfi input format
            '-i', f'testsrc=duration={duration_secs}:size=320x240:rate=30',  # Generate test pattern
            '-c:v', 'libx264',  # Use H.264 codec
            '-y',  # Overwrite output file if exists
            str(filepath)
        ]
        
        print(f"Creating test video file at {filepath}")
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"Successfully created {duration_secs}s test video")
        
    except subprocess.CalledProcessError as e:
        print(f"Error creating test video: {e}")
        print(f"ffmpeg stderr: {e.stderr.decode()}")
        raise
    except FileNotFoundError:
        print("Error: ffmpeg not found. Please install ffmpeg to create test videos.")
        raise

async def main():
    # Get video path from environment or use default
    video_path = os.getenv("TEST_VIDEO_PATH", "tests/fixtures/test_video.mp4")
    video_path = Path(video_path)
    
    if not video_path.parent.exists():
        video_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Create a test video file if none exists
    if not video_path.exists():
        create_test_mp4(video_path)
    
    print(f"Starting video upload from {video_path}...")
    print(f"Checking Vimeo credentials...")
    client = get_vimeo_client()
    
    # Verify credentials by making a simple API call
    try:
        about_me = client.get('/me')
        print(f"Connected to Vimeo as: {about_me.json().get('name', 'Unknown User')}")
    except Exception as e:
        print(f"Failed to verify Vimeo credentials: {str(e)}")
        return
    
    result = await upload_video(
        str(video_path),
        "Test Upload",
        "This is a test video upload via PyVimeo"
    )
    
    print("\nUpload result:", result)
    if result['status'] == 'error':
        print("\nError Details:")
        print(f"Message: {result.get('message')}")
        print(f"Type: {result.get('error_type')}")

if __name__ == "__main__":
    asyncio.run(main())
