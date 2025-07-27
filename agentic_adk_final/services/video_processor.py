import cv2
import os
import asyncio
from typing import List, Dict, Any
from pathlib import Path
import tempfile
import aiofiles
from fastapi import UploadFile
import subprocess

class VideoProcessor:
    def __init__(self):
        self.frames_dir = Path("temp/frames")
        self.frames_dir.mkdir(parents=True, exist_ok=True)

    async def process_youtube_video(self, video_url: str) -> Dict[str, Any]:
        """Process YouTube video and extract frames"""
        try:
            # Use yt-dlp to download video (more reliable than pytube)
            temp_video_path = f"temp/video_{asyncio.get_event_loop().time()}.mp4"
            
            # Download video using yt-dlp
            cmd = [
                "yt-dlp",
                "-f", "best[height<=720]",  # Limit quality for faster processing
                "-o", temp_video_path,
                video_url
            ]
            
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                raise Exception(f"Failed to download video: {stderr.decode()}")
            
            # Extract frames
            frames = await self._extract_frames(temp_video_path,max_frames=10)
            
            # Cleanup
            if os.path.exists(temp_video_path):
                os.remove(temp_video_path)
            
            return {
                "status": "success",
                "frames": frames,
                "total_frames": len(frames)
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "frames": []
            }

    async def process_uploaded_video(self, video_file: UploadFile) -> Dict[str, Any]:
        """Process uploaded video file"""
        try:
            # Save uploaded file temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_file:
                content = await video_file.read()
                temp_file.write(content)
                temp_video_path = temp_file.name
            
            # Extract frames
            frames = await self._extract_frames(temp_video_path)
            
            # Cleanup
            os.unlink(temp_video_path)
            
            return {
                "status": "success",
                "frames": frames,
                "total_frames": len(frames)
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "frames": []
            }

    async def _extract_frames(self, video_path: str, max_frames: int =3) -> List[str]:
        """Extract only a limited number of evenly spaced frames"""
        frames = []

        def extract_sync():
            cap = cv2.VideoCapture(video_path)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            if total_frames == 0:
                return frames

            step = max(total_frames // max_frames, 1)
            extracted_count = 0

            for frame_idx in range(0, total_frames, step):
                if extracted_count >= max_frames:
                    break

                cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
                ret, frame = cap.read()
                if not ret:
                    break

                frame_filename = f"frame_{extracted_count:06d}.jpg"
                frame_path = self.frames_dir / frame_filename
                cv2.imwrite(str(frame_path), frame)
                frames.append(str(frame_path))
                extracted_count += 1

            cap.release()
            return frames

        # Run in thread pool
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, extract_sync)



    def draw_circle_on_frame(self, image_path: str, output_path: str, x: int, y: int, radius: int = None):
        """Draw circle on frame to mark anomaly with dynamic radius based on image size"""
        image = cv2.imread(image_path)
        if image is not None:
            height, width = image.shape[:2]

            # Use dynamic radius if not specified
            if radius is None:
                radius = max(min(width, height) // 10, 20)  # 10% of min dimension, min 20px

            # Ensure circle stays within image bounds
            x = max(radius, min(x, width - radius))
            y = max(radius, min(y, height - radius))

            # Draw circle and label
            cv2.circle(image, (x, y), radius, (0, 0, 255), 3)
            cv2.putText(image, "ALERT!", (x - radius, y - radius - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

            cv2.imwrite(output_path, image)
            return output_path

        return None
