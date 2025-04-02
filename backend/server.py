from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os
import requests
import base64
from pathlib import Path
import time
import logging
from typing import List, Optional
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models
class ImageRequest(BaseModel):
    prompt: str
    n: Optional[int] = 1

class ImageResponse(BaseModel):
    success: bool
    images: List[dict]

# Initialize FastAPI app
app = FastAPI(title="XImage API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3004", "http://localhost:3005"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
XAI_API_KEY = os.getenv("XAI_API_KEY")
XAI_API_URL = os.getenv("XAI_API_URL", "https://api.x.ai/v1/images/generations")
UPLOADS_DIR = Path(__file__).parent / "uploads"

# Create uploads directory if it doesn't exist
UPLOADS_DIR.mkdir(exist_ok=True)
logger.info(f"Using uploads directory: {UPLOADS_DIR}")

def save_base64_image(base64_data: str, filename: str) -> str:
    """Save base64 image data to a file."""
    try:
        # Remove data URL prefix if present
        if ',' in base64_data:
            base64_data = base64_data.split(',')[1]
        
        img_path = UPLOADS_DIR / filename
        img_data = base64.b64decode(base64_data)
        
        with open(img_path, 'wb') as f:
            f.write(img_data)
            
        logger.info(f"Saved base64 image to: {img_path}")
        return str(img_path)
    except Exception as e:
        logger.error(f"Error saving base64 image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def download_image(url: str, filename: str) -> str:
    """Download image from URL and save it locally."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        img_path = UPLOADS_DIR / filename
        with open(img_path, 'wb') as f:
            f.write(response.content)
            
        logger.info(f"Downloaded image from URL to: {img_path}")
        return str(img_path)
    except Exception as e:
        logger.error(f"Error downloading image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate")
async def generate_images(request: Request):
    """Generate images using the Grok API."""
    try:
        data = await request.json()
        prompt = data.get("prompt")
        n = data.get("n", 1)

        if not prompt:
            raise HTTPException(status_code=400, detail="Prompt is required")

        logger.info(f"\n===== NEW IMAGE GENERATION REQUEST =====")
        logger.info(f"Prompt: {prompt}, Number of images: {n}")

        # Make request to Grok API
        response = requests.post(
            XAI_API_URL,
            json={
                "model": "grok-2-image-1212",
                "prompt": prompt,
                "n": n
            },
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {XAI_API_KEY}"
            }
        )
        response.raise_for_status()
        
        # Process response
        response_data = response.json()
        logger.info(f"API Response: {response_data}")
        
        images = []
        if response_data and response_data.get("data"):
            for i, item in enumerate(response_data["data"]):
                try:
                    filename = f"{int(time.time() * 1000)}-{i}.jpg"
                    image_id = f"img_{int(time.time() * 1000)}_{i}"
                    
                    if isinstance(item, dict) and item.get("b64_json"):
                        img_path = save_base64_image(item["b64_json"], filename)
                    elif isinstance(item, dict) and item.get("url"):
                        img_path = await download_image(item["url"], filename)
                    elif isinstance(item, str) and item.startswith("http"):
                        img_path = await download_image(item, filename)
                    else:
                        logger.warning(f"Unsupported image format for item {i}")
                        continue

                    image_url = f"/api/images/{filename}"
                    logger.info(f"Processing image {i} - URL: {image_url}")
                    
                    images.append({
                        "id": image_id,
                        "filename": filename,
                        "url": image_url,
                        "prompt": prompt
                    })
                    logger.info(f"Added image {i} to response")
                except Exception as e:
                    logger.error(f"Error processing image {i}: {e}")

        return JSONResponse({
            "success": True,
            "images": images
        })

    except Exception as e:
        logger.error(f"Error generating images: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/images")
async def list_images():
    """List all generated images."""
    try:
        files = [f for f in UPLOADS_DIR.iterdir() if f.is_file()]
        images = []
        
        for file in files:
            image_id = f"img_{file.name}"
            images.append({
                "id": image_id,
                "filename": file.name,
                "url": f"/api/images/{file.name}"
            })
            
        return JSONResponse({
            "success": True,
            "images": images
        })
    except Exception as e:
        logger.error(f"Error listing images: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Mount the uploads directory for serving static files
app.mount("/api/images", StaticFiles(directory=str(UPLOADS_DIR)), name="images")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
