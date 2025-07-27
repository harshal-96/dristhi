from typing import Dict, Any, Optional
import json
import logging
from datetime import datetime
from utils.config import settings

logger = logging.getLogger(__name__)

class A2AProtocol:
    """Implementation of A2A (Agent-to-Agent) Protocol for inter-agent communication"""
    
    def __init__(self):
        self.protocol_version = "1.0"
        self.base_url = settings.BASE_URL
    
    def create_agent_card(self, agent_name: str, description: str, capabilities: list, 
                         endpoints: Dict[str, str], auth_config: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """Create an A2A protocol compliant agent card"""
        
        agent_card = {
            "@context": "https://a2a.org/agent-card/v1",
            "id": f"{self.base_url}/.well-known/{agent_name}.json",
            "name": agent_name,
            "description": description,
            "capabilities": capabilities,
            "endpoints": endpoints,
            "version": self.protocol_version,
            "created": datetime.utcnow().isoformat(),
            "google_adk_enabled": True
        }
        
        if auth_config:
            agent_card["auth"] = auth_config
        
        return agent_card
    
    def create_task_request(self, task_id: str, task_type: str, payload: Dict[str, Any], 
                           requester_id: str, target_agent: Optional[str] = None) -> Dict[str, Any]:
        """Create a standardized task request"""
        
        task_request = {
            "task_id": task_id,
            "task_type": task_type,
            "payload": payload,
            "requester_id": requester_id,
            "created_at": datetime.utcnow().isoformat(),
            "protocol_version": self.protocol_version
        }
        
        if target_agent:
            task_request["target_agent"] = target_agent
        
        return task_request
    
    def create_task_response(self, task_id: str, status: str, result: Any, 
                            agent_id: str, error_message: Optional[str] = None) -> Dict[str, Any]:
        """Create a standardized task response"""
        
        task_response = {
            "task_id": task_id,
            "status": status,  # "completed", "failed", "in_progress"
            "result": result,
            "agent_id": agent_id,
            "completed_at": datetime.utcnow().isoformat(),
            "protocol_version": self.protocol_version
        }
        
        if error_message:
            task_response["error_message"] = error_message
        
        return task_response
    
    def validate_agent_card(self, agent_card: Dict[str, Any]) -> Dict[str, Any]:
        """Validate an agent card against A2A protocol standards"""
        
        validation_result = {
            "valid": True,
            "errors": [],
            "warnings": [],
            "validated_at": datetime.utcnow().isoformat()
        }
        
        # Required fields
        required_fields = ["@context", "id", "name", "description", "capabilities", "endpoints"]
        
        for field in required_fields:
            if field not in agent_card:
                validation_result["valid"] = False
                validation_result["errors"].append(f"Missing required field: {field}")
        
        # Validate context
        if agent_card.get("@context") != "https://a2a.org/agent-card/v1":
            validation_result["warnings"].append("Non-standard @context value")
        
        # Validate endpoints
        if "endpoints" in agent_card:
            endpoints = agent_card["endpoints"]
            if not isinstance(endpoints, dict):
                validation_result["valid"] = False
                validation_result["errors"].append("Endpoints must be a dictionary")
            else:
                # Check for common endpoint types
                recommended_endpoints = ["task", "status", "health"]
                for endpoint in recommended_endpoints:
                    if endpoint not in endpoints:
                        validation_result["warnings"].append(f"Recommended endpoint missing: {endpoint}")
        
        # Validate capabilities
        if "capabilities" in agent_card:
            capabilities = agent_card["capabilities"]
            if not isinstance(capabilities, list):
                validation_result["valid"] = False
                validation_result["errors"].append("Capabilities must be a list")
        
        return validation_result
    
    def create_discovery_response(self, agents: list) -> Dict[str, Any]:
        """Create a standardized agent discovery response"""
        
        return {
            "agents": agents,
            "total_count": len(agents),
            "discovered_at": datetime.utcnow().isoformat(),
            "protocol_version": self.protocol_version
        }
    
    def create_status_response(self, agent_id: str, status: str, 
                              additional_info: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Create a standardized status response"""
        
        status_response = {
            "agent_id": agent_id,
            "status": status,  # "operational", "degraded", "offline"
            "timestamp": datetime.utcnow().isoformat(),
            "protocol_version": self.protocol_version
        }
        
        if additional_info:
            status_response.update(additional_info)
        
        return status_response
    
    def parse_task_request(self, request_data: str) -> Dict[str, Any]:
        """Parse and validate a task request"""
        
        try:
            task_request = json.loads(request_data)
            
            # Basic validation
            required_fields = ["task_id", "task_type", "payload", "requester_id"]
            for field in required_fields:
                if field not in task_request:
                    raise ValueError(f"Missing required field: {field}")
            
            return task_request
            
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in task request: {e}")
        except Exception as e:
            raise ValueError(f"Task request validation failed: {e}")
    
    def format_error_response(self, error_code: str, error_message: str, 
                             task_id: Optional[str] = None) -> Dict[str, Any]:
        """Format a standardized error response"""
        
        error_response = {
            "error": {
                "code": error_code,
                "message": error_message,
                "timestamp": datetime.utcnow().isoformat()
            },
            "protocol_version": self.protocol_version
        }
        
        if task_id:
            error_response["task_id"] = task_id
        
        return error_response
