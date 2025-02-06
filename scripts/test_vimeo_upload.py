import asyncio
import os
from pathlib import Path
from app.vimeo.upload import upload_video

async def main():
    # Get video path from environment or use default
    video_path = os.getenv("TEST_VIDEO_PATH", "tests/fixtures/test_video.mp4")
    video_path = Path(video_path)
    
    if not video_path.parent.exists():
        video_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Create a test video file if none exists
    if not video_path.exists():
        print(f"Creating test video file at {video_path}")
        # Create a minimal valid MP4 file for testing
        with open(video_path, 'wb') as f:
            f.write(b'\x00' * 1024)  # 1KB dummy video file
    
    print(f"Starting video upload from {video_path}...")
    result = await upload_video(
        str(video_path),
        "Test Upload",
        "This is a test video upload via PyVimeo"
    )
    
    print("\nUpload result:", result)

if __name__ == "__main__":
    asyncio.run(main())
