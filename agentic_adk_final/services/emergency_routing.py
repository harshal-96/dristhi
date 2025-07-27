import requests
import asyncio
from typing import Dict, Any
import os

class EmergencyRouter:
    def __init__(self):
        self.google_api_key = os.getenv("GOOGLE_API_KEY", "AIzaSyCaPXuD7N5pw9YgM8oiyaVEEnijUH16LvA")
        
        # Map incident types to emergency services
        self.emergency_type_keywords = {
            'fire': 'fire station',
            'crime': 'police station',
            'crowd': 'police station',
            'injury': 'hospital',
            'medical': 'hospital',
            'general': 'police station'
        }

    async def get_nearest_emergency_station(
        self, 
        lat: float, 
        lng: float, 
        incident_type: str
    ) -> Dict[str, Any]:
        """Find nearest emergency station and get route"""
        try:
            # Determine the type of emergency service needed
            place_type = self.emergency_type_keywords.get(incident_type.lower(), 'police station')
            
            # Find nearby emergency stations
            station_info = await self._find_nearby_stations(lat, lng, place_type)
            
            if not station_info:
                raise Exception("No nearby emergency stations found")
            
            # Get route to the nearest station
            route_info = await self._get_route(
                station_info['lat'], 
                station_info['lng'], 
                lat, 
                lng
            )
            
            return {
                'station_name': station_info['name'],
                'station_type': place_type,
                'station_location': (station_info['lat'], station_info['lng']),
                'incident_location': (lat, lng),
                'distance': route_info['distance'],
                'duration': route_info['duration'],
                'route_steps': route_info['steps'],
                'emergency_contacts': self._get_emergency_contacts(incident_type),
                'priority_level': self._get_priority_level(incident_type),
                'recommended_units': self._get_recommended_units(incident_type)
            }
            
        except Exception as e:
            # Return fallback emergency response
            return {
                'station_name': 'Emergency Services',
                'station_type': place_type,
                'distance': 'Unknown',
                'duration': 'Unknown',
                'route_steps': ['Contact emergency services immediately'],
                'emergency_contacts': self._get_emergency_contacts(incident_type),
                'error': str(e)
            }

    async def _find_nearby_stations(self, lat: float, lng: float, place_type: str) -> Dict[str, Any]:
        """Find nearby emergency stations"""
        try:
            places_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
            params = {
                'location': f"{lat},{lng}",
                'radius': 10000,  # 10km radius
                'keyword': place_type,
                'key': self.google_api_key
            }
            
            response = requests.get(places_url, params=params)
            data = response.json()
            
            if data.get('results'):
                nearest = data['results'][0]
                return {
                    'name': nearest['name'],
                    'lat': nearest['geometry']['location']['lat'],
                    'lng': nearest['geometry']['location']['lng'],
                    'rating': nearest.get('rating', 'N/A'),
                    'place_id': nearest['place_id']
                }
            else:
                # Fallback to mock data
                return {
                    'name': f'Nearest {place_type.title()}',
                    'lat': lat + 0.01,  # Slightly offset
                    'lng': lng + 0.01,
                    'rating': 'N/A',
                    'place_id': 'mock_id'
                }
                
        except Exception as e:
            # Return mock station data
            return {
                'name': f'Emergency {place_type.title()}',
                'lat': lat + 0.01,
                'lng': lng + 0.01,
                'rating': 'N/A',
                'place_id': 'fallback_id'
            }

    async def _get_route(self, origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float) -> Dict[str, Any]:
        """Get route from emergency station to incident location"""
        try:
            directions_url = "https://maps.googleapis.com/maps/api/directions/json"
            params = {
                'origin': f"{origin_lat},{origin_lng}",
                'destination': f"{dest_lat},{dest_lng}",
                'mode': 'driving',
                'key': self.google_api_key
            }
            
            response = requests.get(directions_url, params=params)
            data = response.json()
            
            if data.get('routes'):
                route = data['routes'][0]['legs'][0]
                return {
                    'distance': route['distance']['text'],
                    'duration': route['duration']['text'],
                    'steps': [step['html_instructions'] for step in route['steps'][:10]]  # First 10 steps
                }
            else:
                # Fallback route info
                return {
                    'distance': '2.5 km',
                    'duration': '5 minutes',
                    'steps': [
                        'Head towards incident location',
                        'Follow main roads',
                        'Arrive at destination'
                    ]
                }
                
        except Exception as e:
            return {
                'distance': 'Unknown',
                'duration': 'Unknown',
                'steps': ['Navigate to incident location using GPS'],
                'error': str(e)
            }

    def _get_emergency_contacts(self, incident_type: str) -> Dict[str, str]:
        """Get relevant emergency contacts"""
        contacts = {
            'Emergency Services': '911',
            'Police': '911',
            'Fire Department': '911',
            'Medical Emergency': '911'
        }
        
        if incident_type.lower() == 'fire':
            contacts['Fire Chief'] = '911'
            contacts['Hazmat Team'] = '911'
        elif incident_type.lower() in ['crowd', 'crime']:
            contacts['Police Dispatch'] = '911'
            contacts['SWAT Team'] = '911'
        elif incident_type.lower() in ['injury', 'medical']:
            contacts['Ambulance'] = '911'
            contacts['Hospital'] = '911'
        
        return contacts

    def _get_priority_level(self, incident_type: str) -> str:
        """Get priority level for incident type"""
        priority_map = {
            'fire': 'CRITICAL',
            'injury': 'HIGH',
            'medical': 'HIGH',
            'crime': 'HIGH',
            'crowd': 'MEDIUM',
            'general': 'MEDIUM'
        }
        return priority_map.get(incident_type.lower(), 'MEDIUM')

    def _get_recommended_units(self, incident_type: str) -> list:
        """Get recommended emergency units"""
        units_map = {
            'fire': ['Fire Engine', 'Ladder Truck', 'Ambulance', 'Fire Chief'],
            'injury': ['Ambulance', 'Paramedic Unit', 'Police Unit'],
            'medical': ['Ambulance', 'Paramedic Unit', 'Medical Supervisor'],
            'crime': ['Police Units (2-3)', 'Supervisor', 'Detective'],
            'crowd': ['Police Units (3-5)', 'Crowd Control Team', 'Supervisor'],
            'general': ['Police Unit', 'Supervisor']
        }
        return units_map.get(incident_type.lower(), ['Emergency Response Unit'])
