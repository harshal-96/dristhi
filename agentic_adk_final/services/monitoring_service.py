import asyncio
import random
from typing import List, Dict, Any
from datetime import datetime, timedelta

class MonitoringService:
    def __init__(self):
        self.active_cameras = []
        self.drone_feeds = []
        self.monitoring_active = False
        
    async def start_monitoring(self):
        """Start the monitoring service"""
        self.monitoring_active = True
        
        # Initialize mock camera feeds
        self.active_cameras = [
            {
                "id": "CAM_001",
                "name": "Main Entrance",
                "location": "North Gate",
                "status": "active",
                "stream_url": "rtmp://example.com/cam1",
                "last_frame": datetime.now(),
                "crowd_density": 0.3
            },
            {
                "id": "CAM_002", 
                "name": "Central Plaza",
                "location": "Center Area",
                "status": "active",
                "stream_url": "rtmp://example.com/cam2",
                "last_frame": datetime.now(),
                "crowd_density": 0.7
            },
            {
                "id": "CAM_003",
                "name": "Exit Gate A",
                "location": "South Exit",
                "status": "warning",
                "stream_url": "rtmp://example.com/cam3",
                "last_frame": datetime.now(),
                "crowd_density": 0.9
            }
        ]
        
        # Initialize drone feeds
        self.drone_feeds = [
            {
                "id": "DRONE_ALPHA",
                "name": "Drone Alpha",
                "location": {"lat": 40.7580, "lng": -73.9855},
                "status": "active",
                "battery": 85,
                "mission": "Sector 1 Patrol",
                "altitude": 150
            },
            {
                "id": "DRONE_BETA",
                "name": "Drone Beta", 
                "location": {"lat": 40.7590, "lng": -73.9845},
                "status": "active",
                "battery": 72,
                "mission": "Sector 2 Surveillance",
                "altitude": 200
            }
        ]
        
        print("✅ Monitoring service started successfully")

    async def get_camera_feeds(self) -> List[Dict[str, Any]]:
        """Get current camera feed status"""
        # Simulate real-time updates
        for camera in self.active_cameras:
            camera["last_frame"] = datetime.now()
            camera["crowd_density"] = max(0.1, min(1.0, camera["crowd_density"] + random.uniform(-0.1, 0.1)))
            
            # Update status based on crowd density
            if camera["crowd_density"] > 0.8:
                camera["status"] = "critical"
            elif camera["crowd_density"] > 0.6:
                camera["status"] = "warning"
            else:
                camera["status"] = "active"
        
        return self.active_cameras

    async def get_crowd_density(self) -> Dict[str, Any]:
        """Get current crowd density analysis"""
        total_density = sum(cam["crowd_density"] for cam in self.active_cameras)
        avg_density = total_density / len(self.active_cameras) if self.active_cameras else 0
        
        return {
            "average_density": round(avg_density, 2),
            "peak_areas": [cam["name"] for cam in self.active_cameras if cam["crowd_density"] > 0.7],
            "safe_areas": [cam["name"] for cam in self.active_cameras if cam["crowd_density"] < 0.4],
            "total_cameras": len(self.active_cameras),
            "alert_level": self._get_alert_level(avg_density),
            "timestamp": datetime.now().isoformat()
        }

    async def get_recent_detections(self) -> List[Dict[str, Any]]:
        """Get recent anomaly detections"""
        # Mock recent detections
        detections = [
            {
                "id": "DET_001",
                "timestamp": (datetime.now() - timedelta(minutes=5)).isoformat(),
                "type": "crowd_density",
                "severity": "medium",
                "location": "Central Plaza",
                "description": "High crowd density detected",
                "confidence": 0.85
            },
            {
                "id": "DET_002",
                "timestamp": (datetime.now() - timedelta(minutes=12)).isoformat(),
                "type": "suspicious_activity",
                "severity": "low",
                "location": "North Gate",
                "description": "Unusual movement pattern detected",
                "confidence": 0.65
            },
            {
                "id": "DET_003",
                "timestamp": (datetime.now() - timedelta(minutes=18)).isoformat(),
                "type": "blocked_exit",
                "severity": "high",
                "location": "Exit Gate A",
                "description": "Emergency exit partially blocked",
                "confidence": 0.92
            }
        ]
        
        return detections

    def _get_alert_level(self, density: float) -> str:
        """Determine alert level based on crowd density"""
        if density > 0.8:
            return "CRITICAL"
        elif density > 0.6:
            return "HIGH"
        elif density > 0.4:
            return "MEDIUM"
        else:
            return "LOW"

    async def update_drone_status(self, drone_id: str, status_update: Dict[str, Any]):
        """Update drone status"""
        for drone in self.drone_feeds:
            if drone["id"] == drone_id:
                drone.update(status_update)
                drone["last_updated"] = datetime.now().isoformat()
                break

    async def get_system_health(self) -> Dict[str, Any]:
        """Get overall system health status"""
        active_cameras = len([cam for cam in self.active_cameras if cam["status"] in ["active", "warning"]])
        active_drones = len([drone for drone in self.drone_feeds if drone["status"] == "active"])
        
        return {
            "overall_status": "operational" if active_cameras > 0 and active_drones > 0 else "degraded",
            "active_cameras": active_cameras,
            "total_cameras": len(self.active_cameras),
            "active_drones": active_drones,
            "total_drones": len(self.drone_feeds),
            "system_uptime": "99.8%",
            "last_maintenance": (datetime.now() - timedelta(days=2)).isoformat(),
            "next_maintenance": (datetime.now() + timedelta(days=5)).isoformat()
        }
