from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum

class IncidentType(str, Enum):
    FIRE = "fire"
    CROWD = "crowd"
    CRIME = "crime"
    INJURY = "injury"
    GENERAL = "general"

class IncidentStatus(str, Enum):
    ACTIVE = "active"
    RESOLVED = "resolved"
    INVESTIGATING = "investigating"

class IncidentCreate(BaseModel):
    title: str = Field(..., description="Incident title")
    description: str = Field(..., description="Detailed description")
    location: str = Field(..., description="Location of incident")
    incident_type: IncidentType = Field(default=IncidentType.GENERAL)
    priority: int = Field(default=1, ge=1, le=5, description="Priority level 1-5")
    reporter_name: Optional[str] = None
    reporter_contact: Optional[str] = None
    media_files: Optional[List[str]] = None
    additional_info: Optional[Dict[str, Any]] = None

class IncidentResponse(BaseModel):
    id: int
    title: str
    description: str
    location: str
    incident_type: IncidentType
    status: IncidentStatus
    priority: int
    created_at: datetime
    updated_at: datetime
    agent_analysis: Optional[Dict[str, Any]] = None
    affected_areas: Optional[Dict[str, Any]] = None
    emergency_response: Optional[Dict[str, Any]] = None
    preventive_measures: Optional[List[str]] = None

class MonitoringData(BaseModel):
    camera_id: str
    location: str
    status: str
    last_frame_time: datetime
    crowd_density: Optional[float] = None
    anomalies_detected: Optional[List[Dict[str, Any]]] = None

class DroneData(BaseModel):
    drone_id: str
    location: Dict[str, float]  # lat, lng
    status: str
    battery_level: float
    current_mission: Optional[str] = None
    last_detection: Optional[Dict[str, Any]] = None

class EmergencyResponse(BaseModel):
    station_name: str
    station_type: str
    distance: str
    duration: str
    route_steps: List[str]
    coordinates: Dict[str, float]

class AffectedArea(BaseModel):
    location: str
    coordinates: Dict[str, float]
    radius: float
    severity: str
    map_html: str

class AlertData(BaseModel):
    id: str
    type: str
    message: str
    severity: str
    timestamp: datetime
    location: Optional[str] = None
    resolved: bool = False
