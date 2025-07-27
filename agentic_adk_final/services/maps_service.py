import requests
import asyncio
from typing import Dict, Any, Tuple
import os

class MapsService:
    def __init__(self):
        self.google_api_key = os.getenv("GOOGLE_API_KEY", "AIzaSyCaPXuD7N5pw9YgM8oiyaVEEnijUH16LvA")
        
    async def get_coordinates(self, place_name: str) -> Tuple[float, float]:
        """Get coordinates for a place name"""
        url = "https://maps.googleapis.com/maps/api/geocode/json"
        params = {
            "address": place_name,
            "key": self.google_api_key
        }
        
        try:
            response = requests.get(url, params=params)
            data = response.json()
            
            if data["status"] == "OK":
                location = data["results"][0]["geometry"]["location"]
                return location["lat"], location["lng"]
            else:
                raise Exception(f"Geocoding failed: {data['status']}")
                
        except Exception as e:
            # Fallback coordinates (example: Times Square, NYC)
            return 40.7580, -73.9855

    async def get_affected_areas(self, location: str) -> Dict[str, Any]:
        """Get affected areas map for a location"""
        try:
            lat, lng = await self.get_coordinates(location)
            map_html = self._generate_map_html(lat, lng, location)
            
            return {
                "location": location,
                "coordinates": {"lat": lat, "lng": lng},
                "radius": 500,  # 500 meter radius
                "severity": "medium",
                "map_html": map_html,
                "affected_population_estimate": "500-1000 people",
                "evacuation_routes": [
                    "North exit via Main Street",
                    "South exit via Park Avenue",
                    "Emergency exit via Service Road"
                ]
            }
            
        except Exception as e:
            return {
                "location": location,
                "coordinates": {"lat": 0, "lng": 0},
                "error": str(e),
                "map_html": "<p>Map generation failed</p>"
            }

    def _generate_map_html(self, lat: float, lng: float, location: str = "Impact Zone") -> str:
        """Generate HTML map with impact zone"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                #map {{
                    height: 400px;
                    width: 100%;
                    border-radius: 8px;
                }}
                .info-panel {{
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    margin-top: 10px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }}
            </style>
        </head>
        <body>
            <div id="map"></div>
            <div class="info-panel">
                <h4>🚨 Affected Area: {location}</h4>
                <p><strong>Coordinates:</strong> {lat:.6f}, {lng:.6f}</p>
                <p><strong>Impact Radius:</strong> 500 meters</p>
                <p><strong>Estimated Affected Population:</strong> 500-1000 people</p>
            </div>
            
            <script>
                function initMap() {{
                    const location = {{ lat: {lat}, lng: {lng} }};
                    const map = new google.maps.Map(document.getElementById("map"), {{
                        zoom: 15,
                        center: location,
                        mapTypeId: 'roadmap'
                    }});
                    
                    // Main incident marker
                    const marker = new google.maps.Marker({{
                        position: location,
                        map: map,
                        title: "{location}",
                        icon: {{
                            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                    <circle cx="16" cy="16" r="12" fill="#ff4444" stroke="#ffffff" stroke-width="2"/>
                                    <text x="16" y="20" text-anchor="middle" fill="white" font-size="16">⚠</text>
                                </svg>
                            `),
                            scaledSize: new google.maps.Size(32, 32)
                        }}
                    }});
                    
                    // Impact zone circle
                    const impactCircle = new google.maps.Circle({{
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.2,
                        map: map,
                        center: location,
                        radius: 500  // 500 meters
                    }});
                    
                    // Warning zone circle
                    const warningCircle = new google.maps.Circle({{
                        strokeColor: '#FFA500',
                        strokeOpacity: 0.6,
                        strokeWeight: 1,
                        fillColor: '#FFA500',
                        fillOpacity: 0.1,
                        map: map,
                        center: location,
                        radius: 1000  // 1000 meters
                    }});
                    
                    // Info window
                    const infoWindow = new google.maps.InfoWindow({{
                        content: `
                            <div style="padding: 10px;">
                                <h4>🚨 Emergency Incident</h4>
                                <p><strong>Location:</strong> {location}</p>
                                <p><strong>Status:</strong> Active</p>
                                <p><strong>Impact Radius:</strong> 500m</p>
                                <p><strong>Warning Zone:</strong> 1000m</p>
                            </div>
                        `
                    }});
                    
                    marker.addListener('click', () => {{
                        infoWindow.open(map, marker);
                    }});
                }}
            </script>
            <script src="https://maps.googleapis.com/maps/api/js?key={self.google_api_key}&callback=initMap&libraries=marker" async defer></script>
        </body>
        </html>
        """
