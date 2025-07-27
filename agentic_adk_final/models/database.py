import asyncio
import aiosqlite
from typing import List, Dict, Any, Optional
from datetime import datetime
import json

DATABASE_URL = "safety_monitoring.db"

async def init_db():
    """Initialize the database with required tables"""
    async with aiosqlite.connect(DATABASE_URL) as db:
        # Incidents table
        await db.execute("""
            CREATE TABLE IF NOT EXISTS incidents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                location TEXT NOT NULL,
                incident_type TEXT NOT NULL,
                status TEXT DEFAULT 'active',
                priority INTEGER DEFAULT 1,
                reporter_name TEXT,
                reporter_contact TEXT,
                media_files TEXT,
                additional_info TEXT,
                agent_analysis TEXT,
                affected_areas TEXT,
                emergency_response TEXT,
                preventive_measures TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Monitoring data table
        await db.execute("""
            CREATE TABLE IF NOT EXISTS monitoring_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                camera_id TEXT NOT NULL,
                location TEXT NOT NULL,
                status TEXT NOT NULL,
                crowd_density REAL,
                anomalies_detected TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Drone data table
        await db.execute("""
            CREATE TABLE IF NOT EXISTS drone_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                drone_id TEXT NOT NULL,
                location TEXT NOT NULL,
                status TEXT NOT NULL,
                battery_level REAL,
                current_mission TEXT,
                last_detection TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Alerts table
        await db.execute("""
            CREATE TABLE IF NOT EXISTS alerts (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                message TEXT NOT NULL,
                severity TEXT NOT NULL,
                location TEXT,
                resolved BOOLEAN DEFAULT FALSE,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        await db.commit()

async def get_db():
    """Get database connection"""
    return aiosqlite.connect(DATABASE_URL)

class DatabaseManager:
    @staticmethod
    async def create_incident(incident_data: Dict[str, Any]) -> int:
        """Create a new incident"""
        async with aiosqlite.connect(DATABASE_URL) as db:
            cursor = await db.execute("""
                INSERT INTO incidents (
                    title, description, location, incident_type, priority,
                    reporter_name, reporter_contact, media_files, additional_info
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                incident_data.get("title"),
                incident_data.get("description"),
                incident_data.get("location"),
                incident_data.get("incident_type"),
                incident_data.get("priority", 1),
                incident_data.get("reporter_name"),
                incident_data.get("reporter_contact"),
                json.dumps(incident_data.get("media_files", [])),
                json.dumps(incident_data.get("additional_info", {}))
            ))
            await db.commit()
            return cursor.lastrowid

    @staticmethod
    async def update_incident_analysis(incident_id: int, analysis_data: Dict[str, Any]):
        """Update incident with agent analysis"""
        async with aiosqlite.connect(DATABASE_URL) as db:
            await db.execute("""
                UPDATE incidents SET 
                    agent_analysis = ?,
                    affected_areas = ?,
                    emergency_response = ?,
                    preventive_measures = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (
                json.dumps(analysis_data.get("agent_analysis", {})),
                json.dumps(analysis_data.get("affected_areas", {})),
                json.dumps(analysis_data.get("emergency_response", {})),
                json.dumps(analysis_data.get("preventive_measures", [])),
                incident_id
            ))
            await db.commit()

    @staticmethod
    async def get_incidents(limit: int = 100) -> List[Dict[str, Any]]:
        """Get all incidents"""
        async with aiosqlite.connect(DATABASE_URL) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute("""
                SELECT * FROM incidents 
                ORDER BY created_at DESC 
                LIMIT ?
            """, (limit,))
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]

    @staticmethod
    async def get_incident(incident_id: int) -> Optional[Dict[str, Any]]:
        """Get specific incident"""
        async with aiosqlite.connect(DATABASE_URL) as db:
            db.row_factory = aiosqlite.Row
            cursor = await db.execute("""
                SELECT * FROM incidents WHERE id = ?
            """, (incident_id,))
            row = await cursor.fetchone()
            return dict(row) if row else None
