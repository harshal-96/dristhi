import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv  # correct import for loading .env files

# Load environment variables from a .env file into the environment
load_dotenv()

class Settings(BaseSettings):
    # API Keys
    google_api_key: str = os.getenv("GOOGLE_API_KEY", "")
    google_maps_api_key: str = os.getenv("GOOGLE_MAPS_API_KEY", "")
    tavily_api_key: str = os.getenv("TAVILY_API_KEY", "")
    twitter_bearer_token: str = os.getenv("TWITTER_BEARER_TOKEN", "")
    
    # Database
    database_url: str = "sqlite:///./safety_monitoring.db"
    
    # Google Cloud
    google_cloud_project: str = os.getenv("GOOGLE_CLOUD_PROJECT", "")
    google_cloud_location: str = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
    google_genai_use_vertexai: str = os.getenv("GOOGLE_GENAI_USE_VERTEXAI", "FALSE")
    
    # Application Settings
    app_name: str = "Public Safety Monitoring System"
    debug: bool = True
    
    # Video Processing
    max_video_size_mb: int = 100
    frames_per_second: int = 1
    max_processing_time: int = 300  # 5 minutes
    
    # Emergency Settings
    emergency_response_timeout: int = 30  # seconds
    max_search_radius_km: int = 10
    
    class Config:
        env_file = ".env"
        extra = "ignore"  # This allows extra fields to be ignored

settings = Settings()
