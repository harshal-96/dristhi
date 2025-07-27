# Create required directories first
import os
os.makedirs("temp/frames", exist_ok=True)
os.makedirs("static", exist_ok=True)
os.makedirs("logs", exist_ok=True)

from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks,Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
from datetime import datetime
from typing import List, Dict, Any, Optional
import asyncio
import json
from pathlib import Path
from dotenv import load_dotenv  # correct import for loading .env files

# Load environment variables from a .env file into the environment
load_dotenv()





# Import our modules with better error handling
MODULES_AVAILABLE = True
try:
    from models.database import init_db, get_db
    from models.schemas import (
        IncidentCreate, IncidentResponse, 
        MonitoringData, DroneData,
        EmergencyResponse, AffectedArea
    )
    from services.video_processor import VideoProcessor
    from services.ai_analyzer import AIAnalyzer
    from services.multi_agent_system import MultiAgentIncidentManager
    from services.maps_service import MapsService
    from services.emergency_routing import EmergencyRouter
    from services.monitoring_service import MonitoringService
    from utils.config import settings
    print("✅ All modules loaded successfully")
except ImportError as e:
    print(f"⚠️  Warning: Some modules could not be imported: {e}")
    print("🔧 The system will run with limited functionality.")
    print("🔧 Run 'python install_dependencies.py' for full features")
    MODULES_AVAILABLE = False
    
    # Create minimal settings object
    class MockSettings:
        app_name = "Public Safety Monitoring System"
        debug = True
    settings = MockSettings()

# Initialize FastAPI app
app = FastAPI(
    title="Public Safety Monitoring System",
    description="AI-powered safety monitoring system for crowded public places",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/temp", StaticFiles(directory="temp"), name="temp")
# Static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize services
video_processor = VideoProcessor()
ai_analyzer = AIAnalyzer()
multi_agent_manager = MultiAgentIncidentManager()
maps_service = MapsService()
emergency_router = EmergencyRouter()
monitoring_service = MonitoringService()

# Global state for real-time data
monitoring_data = {
    "active_cameras": [],
    "drone_feeds": [],
    "incidents": [],
    "alerts": []
}

@app.on_event("startup")
async def startup_event():
    """Initialize database and services on startup"""
    await init_db()
    await monitoring_service.start_monitoring()
    print("🚀 Public Safety Monitoring System started successfully!")

@app.get("/", response_class=HTMLResponse)
async def dashboard():
    """Main dashboard page"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Public Safety Monitoring Dashboard</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .nav { display: flex; gap: 20px; margin-bottom: 20px; }
            .nav-item { padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; }
            .nav-item:hover { background: #2980b9; }
            .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
            .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .status-indicator { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; }
            .status-active { background: #27ae60; }
            .status-warning { background: #f39c12; }
            .status-danger { background: #e74c3c; }
            .alert { padding: 10px; margin: 10px 0; border-radius: 4px; }
            .alert-info { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
            .alert-warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; }
            .alert-danger { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🛡️ Public Safety Monitoring System</h1>
            <p>Real-time monitoring and incident management for crowded public places</p>
        </div>
        
        <div class="nav">
            <a href="#dashboard" class="nav-item">Dashboard</a>
            <a href="#monitoring" class="nav-item">Live Monitoring</a>
            <a href="#drone" class="nav-item">Drone Surveillance</a>
            <a href="#incidents" class="nav-item">Incident Management</a>
            <a href="#emergency" class="nav-item">Emergency Response</a>
        </div>
        
        <div class="dashboard-grid">
            <div class="card">
                <h3>🎥 Active Cameras</h3>
                <div id="camera-status">
                    <div><span class="status-indicator status-active"></span>Camera 1 - Main Entrance</div>
                    <div><span class="status-indicator status-active"></span>Camera 2 - Central Plaza</div>
                    <div><span class="status-indicator status-warning"></span>Camera 3 - Exit Gate A</div>
                </div>
            </div>
            
            <div class="card">
                <h3>🚁 Drone Status</h3>
                <div id="drone-status">
                    <div><span class="status-indicator status-active"></span>Drone Alpha - Sector 1</div>
                    <div><span class="status-indicator status-active"></span>Drone Beta - Sector 2</div>
                </div>
            </div>
            
            <div class="card">
                <h3>⚠️ Active Alerts</h3>
                <div id="alerts">
                    <div class="alert alert-info">System operational - All cameras online</div>
                    <div class="alert alert-warning">High crowd density detected in Sector 2</div>
                </div>
            </div>
            
            <div class="card">
                <h3>📊 Statistics</h3>
                <div>
                    <p><strong>Total Incidents Today:</strong> <span id="incident-count">3</span></p>
                    <p><strong>Average Response Time:</strong> <span id="response-time">2.5 minutes</span></p>
                    <p><strong>Active Monitoring Areas:</strong> <span id="monitoring-areas">5</span></p>
                </div>
            </div>
        </div>
        
        <script>
            // Auto-refresh dashboard data
            setInterval(async () => {
                try {
                    const response = await fetch('/api/dashboard/status');
                    const data = await response.json();
                    // Update dashboard elements with real data
                    console.log('Dashboard updated:', data);
                } catch (error) {
                    console.error('Failed to update dashboard:', error);
                }
            }, 5000);
        </script>
    </body>
    </html>
    """

# API Routes

@app.get("/api/dashboard/status")
async def get_dashboard_status():
    """Get current dashboard status"""
    return {
        "timestamp": datetime.now().isoformat(),
        "active_cameras": len(monitoring_data["active_cameras"]),
        "drone_feeds": len(monitoring_data["drone_feeds"]),
        "active_incidents": len([i for i in monitoring_data["incidents"] if i.get("status") == "active"]),
        "total_alerts": len(monitoring_data["alerts"]),
        "system_status": "operational"
    }

@app.get("/api/monitoring/cameras")
async def get_camera_feeds():
    """Get live camera feeds"""
    # Simulate camera feeds from open CCTV sources
    camera_feeds = await monitoring_service.get_camera_feeds()
    return {
        "cameras": camera_feeds,
        "total_active": len(camera_feeds),
        "last_updated": datetime.now().isoformat()
    }

@app.get("/api/monitoring/live")
async def get_live_monitoring():
    """Get live monitoring data"""
    return {
        "cameras": monitoring_data["active_cameras"],
        "alerts": monitoring_data["alerts"][-10:],  # Last 10 alerts
        "crowd_density": await monitoring_service.get_crowd_density(),
        "timestamp": datetime.now().isoformat()
    }



@app.post("/api/drone/analyze")
async def analyze_drone_footage(
    background_tasks: BackgroundTasks,
    video_url: str = None,
    video_file: UploadFile = File(None)
):
    """Analyze drone footage for anomalies"""
    try:
        if video_url:
            # Process YouTube video
            result = await video_processor.process_youtube_video(video_url)
        elif video_file:
            # Process uploaded video file
            result = await video_processor.process_uploaded_video(video_file)
        else:
            raise HTTPException(status_code=400, detail="No video source provided")
        
        # Analyze frames with AI
        analysis_result = await ai_analyzer.analyze_frames(result["frames"])
        summary = await ai_analyzer.generate_summary(analysis_result)

        pdf_path = ai_analyzer.save_summary_to_pdf(summary, output_path="temp/final_report.pdf")
        print(f"Saved PDF summary to {pdf_path}")
        # Generate summary
        summary = await ai_analyzer.generate_summary(analysis_result)
        
        return {
            "status": "success",
            "analysis": analysis_result,
            "summary": summary,
            "processed_frames": len(result["frames"]),
            "anomalies_detected": len([a for a in analysis_result if a.get("anomaly_detected")]),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/api/drone/summary")
async def get_drone_summary():
    """Get drone surveillance summary"""
    return {
        "active_drones": monitoring_data["drone_feeds"],
        "recent_detections": await monitoring_service.get_recent_detections(),
        "summary": "All drones operational. No critical incidents detected in the last hour.",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/alerts")
async def create_alert(request: Request):
    data = await request.json()
    print("Alert received:", data)
    return {"status": "alert created"}

@app.post("/api/incidents/create")
async def create_incident(incident: IncidentCreate):
    """Create new incident and trigger multi-agent analysis"""
    try:
        # Process incident with multi-agent system
        agent_response = await multi_agent_manager.process_incident(incident.dict())
        
        # Get affected areas
        affected_areas = await maps_service.get_affected_areas(
            agent_response.get("location", "")
        )
        
        # Get emergency routing
        emergency_info = await emergency_router.get_nearest_emergency_station(
            affected_areas["coordinates"]["lat"],
            affected_areas["coordinates"]["lng"],
            agent_response.get("incident_type", "general")
        )
        
        incident_data = {
            "id": len(monitoring_data["incidents"]) + 1,
            "timestamp": datetime.now().isoformat(),
            "status": "active",
            "original_data": incident.dict(),
            "agent_analysis": agent_response,
            "affected_areas": affected_areas,
            "emergency_response": emergency_info,
            "preventive_measures": agent_response.get("preventive_measures", [])
        }
        
        monitoring_data["incidents"].append(incident_data)
        
        return {
            "status": "success",
            "incident_id": incident_data["id"],
            "analysis": agent_response,
            "affected_areas": affected_areas,
            "emergency_response": emergency_info
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process incident: {str(e)}")

@app.get("/api/incidents/{incident_id}")
async def get_incident(incident_id: int):
    """Get specific incident details"""
    incident = next((i for i in monitoring_data["incidents"] if i["id"] == incident_id), None)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

@app.get("/api/incidents")
async def get_incidents():
    """Get all incidents"""
    return {
        "incidents": monitoring_data["incidents"],
        "total": len(monitoring_data["incidents"]),
        "active": len([i for i in monitoring_data["incidents"] if i.get("status") == "active"])
    }

@app.get("/api/maps/affected-areas/{location}")
async def get_affected_areas_map(location: str):
    """Get affected areas map for a location"""
    try:
        result = await maps_service.get_affected_areas(location)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate map: {str(e)}")

@app.get("/api/emergency/route")
async def get_emergency_route(
    lat: float,
    lng: float,
    incident_type: str = "general"
):
    """Get emergency route to nearest station"""
    try:
        route_info = await emergency_router.get_nearest_emergency_station(
            lat, lng, incident_type
        )
        return route_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get emergency route: {str(e)}")

@app.get("/api/preventive-measures/{incident_id}")
async def get_preventive_measures(incident_id: int):
    """Get preventive measures for an incident"""
    incident = next((i for i in monitoring_data["incidents"] if i["id"] == incident_id), None)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    return {
        "incident_id": incident_id,
        "preventive_measures": incident.get("preventive_measures", []),
        "recommendations": incident.get("agent_analysis", {}).get("recommendations", [])
    }

# WebSocket endpoint for real-time updates
from fastapi import WebSocket, WebSocketDisconnect

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Send real-time updates
            data = {
                "type": "status_update",
                "data": {
                    "active_cameras": len(monitoring_data["active_cameras"]),
                    "incidents": len(monitoring_data["incidents"]),
                    "timestamp": datetime.now().isoformat()
                }
            }
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(5)  # Update every 5 seconds
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
