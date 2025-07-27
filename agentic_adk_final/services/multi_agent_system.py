import asyncio
import os
from typing import Dict, Any, List
import json
from datetime import datetime

# Try to import Google ADK, fallback if not available
try:
    from google.adk.agents import Agent, LlmAgent, SequentialAgent
    from google.adk.tools import google_search
    ADK_AVAILABLE = True
except ImportError:
    print("Warning: Google ADK not available. Using fallback implementation.")
    ADK_AVAILABLE = False

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    print("Warning: Google GenerativeAI not available.")
    GENAI_AVAILABLE = False

import requests

class MultiAgentIncidentManager:
    def __init__(self):
        # Configure Google AI if available
        if GENAI_AVAILABLE:
            api_key = os.getenv("GOOGLE_API_KEY")
            if api_key:
                genai.configure(api_key=api_key)
            else:
                print("Warning: GOOGLE_API_KEY not found in environment variables")
        
        # Initialize agents if ADK is available
        if ADK_AVAILABLE:
            self._setup_agents()
        else:
            print("Using fallback multi-agent implementation")
        
    def _setup_agents(self):
        """Setup the multi-agent system"""
        
        # Web Search Agent
        self.web_search_agent = LlmAgent(
            name="WebSearchAgent",
            model="gemini-2.0-flash",
            description="Searches the web for relevant information about incidents and safety concerns",
            instruction="""
            You are a web search specialist for emergency and safety incidents.
            When given incident details, search for:
            1. Similar incidents in the area
            2. Current safety alerts or warnings
            3. Emergency response protocols
            4. Weather conditions that might affect the situation
            5. Local emergency services information
            
            Provide comprehensive search results with sources and relevance scores.
            """,
            tools=[google_search]
        )
        
        # Social Media Monitor Agent
        self.social_media_agent = LlmAgent(
            name="SocialMediaAgent",
            model="gemini-2.0-flash",
            description="Monitors social media for incident-related information",
            instruction="""
            You are a social media monitoring specialist for emergency situations.
            Analyze social media data to find:
            1. Real-time reports from the incident location
            2. Eyewitness accounts and photos/videos
            3. Public sentiment and panic levels
            4. Spread of information or misinformation
            5. Community response and self-organization
            
            Provide structured analysis with credibility assessment.
            """,
            tools=[self._create_social_media_tool()]
        )
        
        # Analysis and Summarization Agent
        self.summarizer_agent = LlmAgent(
            name="SummarizerAgent",
            model="gemini-2.0-flash",
            description="Analyzes and summarizes all collected information about incidents",
            instruction="""
            You are an expert incident analyst and summarizer.
            
            Your task is to:
            1. Analyze all collected information from web searches and social media
            2. Identify the incident type (fire, crowd, crime, injury, etc.)
            3. Assess the severity and scope of the incident
            4. Determine affected areas and population at risk
            5. Recommend immediate response actions
            6. Suggest preventive measures for future incidents
            7. Identify key stakeholders who should be notified
            
            Provide a comprehensive incident report in JSON format with:
            {
                "incident_type": "fire/crowd/crime/injury/general",
                "severity": "low/medium/high/critical",
                "affected_areas": ["list of specific locations"],
                "estimated_people_affected": "number or range",
                "immediate_actions": ["list of urgent actions needed"],
                "preventive_measures": ["list of prevention strategies"],
                "stakeholders_to_notify": ["list of relevant authorities"],
                "summary": "comprehensive incident summary",
                "recommendations": ["detailed recommendations"],
                "confidence_level": "percentage of confidence in analysis"
            }
            """,
            output_key="incident_analysis"
        )
        
        # Main coordination agent
        self.coordinator_agent = SequentialAgent(
            name="IncidentCoordinator",
            sub_agents=[
                self.web_search_agent,
                self.social_media_agent,
                self.summarizer_agent
            ],
            description="Coordinates the multi-agent incident analysis process"
        )

    def _create_social_media_tool(self):
        """Create social media monitoring tool"""
        async def monitor_social_media(location: str, keywords: str) -> Dict[str, Any]:
            """Monitor social media for incident-related posts"""
            try:
                # Simulate social media API calls (Twitter, etc.)
                # In production, you would use actual APIs like Twitter API v2
                
                # Mock data for demonstration
                social_data = {
                    "status": "success",
                    "posts_found": 15,
                    "sentiment": "concerned",
                    "key_topics": ["emergency", "crowd", "safety"],
                    "verified_accounts": 3,
                    "media_attachments": 8,
                    "location_tags": [location],
                    "trending_hashtags": ["#emergency", "#safety", "#alert"],
                    "credibility_score": 0.75,
                    "sample_posts": [
                        {
                            "text": f"Large crowd gathering at {location}, seems chaotic",
                            "timestamp": datetime.now().isoformat(),
                            "verified": False,
                            "engagement": 45
                        },
                        {
                            "text": f"Emergency services heading to {location}",
                            "timestamp": datetime.now().isoformat(),
                            "verified": True,
                            "engagement": 120
                        }
                    ]
                }
                
                return social_data
                
            except Exception as e:
                return {
                    "status": "error",
                    "error": str(e),
                    "posts_found": 0
                }
        
        return monitor_social_media

    async def process_incident(self, incident_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process incident through multi-agent system"""
        try:
            # Prepare context for agents
            context = {
                "incident_details": incident_data,
                "location": incident_data.get("location", ""),
                "description": incident_data.get("description", ""),
                "incident_type": incident_data.get("incident_type", "general"),
                "search_keywords": self._generate_search_keywords(incident_data)
            }
            
            # Run web search
            web_results = await self._run_web_search(context)
            
            # Run social media monitoring
            social_results = await self._run_social_monitoring(context)
            
            # Combine results and run summarizer
            combined_data = {
                **context,
                "web_search_results": web_results,
                "social_media_results": social_results
            }
            
            summary_results = await self._run_summarizer(combined_data)
            
            return {
                "status": "success",
                "incident_analysis": summary_results,
                "web_search_data": web_results,
                "social_media_data": social_results,
                "processing_timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "incident_analysis": {},
                "processing_timestamp": datetime.now().isoformat()
            }

    async def _run_web_search(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Run web search agent"""
        try:
            # Simulate web search results
            search_query = f"{context['location']} {context['search_keywords']} emergency safety"
            
            # Mock search results
            results = {
                "query": search_query,
                "results_found": 25,
                "relevant_results": [
                    {
                        "title": f"Safety Alert for {context['location']}",
                        "url": "https://example.com/safety-alert",
                        "snippet": "Local authorities issue safety guidelines...",
                        "relevance": 0.9
                    },
                    {
                        "title": "Emergency Response Protocols",
                        "url": "https://example.com/emergency-protocols",
                        "snippet": "Standard procedures for crowd management...",
                        "relevance": 0.8
                    }
                ],
                "emergency_contacts": [
                    {"service": "Police", "number": "911"},
                    {"service": "Fire Department", "number": "911"},
                    {"service": "Medical Emergency", "number": "911"}
                ]
            }
            
            return results
            
        except Exception as e:
            return {"status": "error", "error": str(e)}

    async def _run_social_monitoring(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Run social media monitoring"""
        try:
            # Use the social media tool
            tool = self._create_social_media_tool()
            results = await tool(
                location=context["location"],
                keywords=context["search_keywords"]
            )
            
            return results
            
        except Exception as e:
            return {"status": "error", "error": str(e)}

    async def _run_summarizer(self, combined_data: Dict[str, Any]) -> Dict[str, Any]:
        """Run summarizer agent"""
        try:
            # Create comprehensive prompt for summarizer
            prompt = f"""
            Analyze the following incident data and provide a comprehensive assessment:
            
            INCIDENT DETAILS:
            - Location: {combined_data.get('location')}
            - Description: {combined_data.get('description')}
            - Type: {combined_data.get('incident_type')}
            
            WEB SEARCH RESULTS:
            {json.dumps(combined_data.get('web_search_results', {}), indent=2)}
            
            SOCIAL MEDIA MONITORING:
            {json.dumps(combined_data.get('social_media_results', {}), indent=2)}
            
            Provide analysis in the specified JSON format.
            """
            
            # Use Gemini directly for summarization
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = await asyncio.to_thread(model.generate_content, prompt)
            
            # Try to parse JSON response
            try:
                analysis = json.loads(response.text)
            except json.JSONDecodeError:
                # Fallback structured response
                analysis = {
                    "incident_type": combined_data.get('incident_type', 'general'),
                    "severity": "medium",
                    "affected_areas": [combined_data.get('location', 'Unknown')],
                    "estimated_people_affected": "Unknown",
                    "immediate_actions": ["Deploy emergency services", "Monitor situation"],
                    "preventive_measures": ["Improve crowd management", "Enhanced monitoring"],
                    "stakeholders_to_notify": ["Local authorities", "Emergency services"],
                    "summary": response.text,
                    "recommendations": ["Immediate response required"],
                    "confidence_level": "75%"
                }
            
            return analysis
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "incident_type": "general",
                "severity": "unknown"
            }

    def _generate_search_keywords(self, incident_data: Dict[str, Any]) -> str:
        """Generate search keywords based on incident data"""
        keywords = []
        
        # Add incident type
        if incident_data.get("incident_type"):
            keywords.append(incident_data["incident_type"])
        
        # Add location-based keywords
        if incident_data.get("location"):
            keywords.extend(["emergency", "safety", "alert"])
        
        # Add description keywords
        description = incident_data.get("description", "").lower()
        if "crowd" in description:
            keywords.extend(["crowd", "gathering", "density"])
        if "fire" in description:
            keywords.extend(["fire", "smoke", "evacuation"])
        if "injury" in description:
            keywords.extend(["medical", "ambulance", "injury"])
        
        return " ".join(keywords)
