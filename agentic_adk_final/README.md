# 🛡️ Public Safety Monitoring System

A comprehensive AI-powered backend system for safety monitoring at crowded public places using FastAPI, Google ADK multi-agent system, and real-time surveillance capabilities.

## 🌟 Features

### 📊 Dashboard
- Real-time monitoring dashboard
- Live camera feeds status
- Drone surveillance overview
- Incident tracking and statistics
- WebSocket-based real-time updates

### 📹 Live Monitoring
- CCTV camera integration from open sources
- Real-time crowd density analysis
- Anomaly detection using AI
- Alert system for safety concerns

### 🚁 Drone Surveillance
- YouTube video processing and analysis
- Frame extraction and AI analysis using Gemini
- Anomaly detection with bounding box marking
- Comprehensive incident summarization

### 🚨 Incident Management
- Multi-agent system using Google ADK
- Web search integration (Tavily API)
- Social media monitoring (Twitter API)
- AI-powered incident analysis and summarization
- Affected area mapping with Google Maps
- Emergency response routing

### 🗺️ Maps & Emergency Response
- Google Maps integration for affected areas
- Impact zone visualization
- Emergency station routing (Police, Fire, Hospital)
- Shortest path calculation to emergency services

## 🏗️ Architecture

### Multi-Agent System
The system uses Google ADK to implement a sophisticated multi-agent architecture:

1. **Web Search Agent** - Searches for relevant incident information
2. **Social Media Agent** - Monitors social platforms for real-time updates
3. **Summarizer Agent** - Analyzes and summarizes all collected data
4. **Coordinator Agent** - Orchestrates the entire process

### Core Services
- **Video Processor** - Handles video download and frame extraction
- **AI Analyzer** - Uses Gemini for intelligent analysis
- **Maps Service** - Google Maps integration for location services
- **Emergency Router** - Calculates optimal emergency response routes
- **Monitoring Service** - Real-time surveillance management

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Google API Key (for Gemini and Maps)
- Optional: Twitter Bearer Token, Tavily API Key

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd safety-monitoring-system
\`\`\`

2. **Run setup script**
\`\`\`bash
chmod +x scripts/setup.sh
./scripts/setup.sh
\`\`\`

3. **Configure environment**
\`\`\`bash
cp .env.example .env
# Edit .env with your API keys
\`\`\`

4. **Start the application**
\`\`\`bash
./scripts/run.sh
\`\`\`

5. **Access the dashboard**
Open http://localhost:8000 in your browser

### Docker Deployment

\`\`\`bash
# Build and run with Docker Compose
docker-compose up -d
\`\`\`

## 📡 API Endpoints

### Dashboard
- `GET /` - Main dashboard interface
- `GET /api/dashboard/status` - System status
- `WebSocket /ws` - Real-time updates

### Monitoring
- `GET /api/monitoring/cameras` - Camera feeds
- `GET /api/monitoring/live` - Live monitoring data

### Drone Surveillance
- `POST /api/drone/analyze` - Analyze drone footage
- `GET /api/drone/summary` - Surveillance summary

### Incident Management
- `POST /api/incidents/create` - Create new incident
- `GET /api/incidents` - List all incidents
- `GET /api/incidents/{id}` - Get specific incident

### Emergency Response
- `GET /api/maps/affected-areas/{location}` - Affected areas map
- `GET /api/emergency/route` - Emergency routing
- `GET /api/preventive-measures/{id}` - Preventive measures

## 🔧 Configuration

### Environment Variables
\`\`\`bash
# Google APIs
GOOGLE_API_KEY=your_google_api_key
GOOGLE_MAPS_API_KEY=your_maps_api_key

# Social Media APIs
TWITTER_BEARER_TOKEN=your_twitter_token
TAVILY_API_KEY=your_tavily_key

# Google Cloud (optional)
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_GENAI_USE_VERTEXAI=FALSE
\`\`\`

### Video Processing
- Supports YouTube URLs and uploaded video files
- Automatic frame extraction at 1 FPS
- AI analysis using Gemini 2.0 Flash
- Anomaly detection with coordinate marking

### Multi-Agent Processing
The system processes incidents through multiple specialized agents:

1. **Information Gathering** - Web search and social media monitoring
2. **Analysis** - AI-powered incident classification and risk assessment
3. **Response Planning** - Emergency routing and preventive measures
4. **Visualization** - Affected area mapping and impact zones

## 🛠️ Development

### Project Structure
\`\`\`
├── main.py                 # FastAPI application
├── models/                 # Data models and database
├── services/              # Core business logic
├── utils/                 # Utilities and configuration
├── static/                # Static files
├── scripts/               # Setup and deployment scripts
└── requirements.txt       # Python dependencies
\`\`\`

### Adding New Features

1. **New Monitoring Source**
   - Extend `MonitoringService`
   - Add new camera/sensor integration
   - Update dashboard display

2. **New Agent**
   - Create agent in `MultiAgentIncidentManager`
   - Define tools and instructions
   - Integrate with coordinator

3. **New Emergency Service**
   - Extend `EmergencyRouter`
   - Add service type mapping
   - Update routing logic

## 📊 Monitoring & Analytics

### Real-time Metrics
- Active camera count
- Drone status and battery levels
- Incident response times
- Crowd density analysis
- System health monitoring

### Alert System
- Configurable alert thresholds
- Multi-level severity (Low, Medium, High, Critical)
- Real-time notifications via WebSocket
- Integration with emergency services

## 🔒 Security & Privacy

- API key management through environment variables
- Secure WebSocket connections
- Data encryption for sensitive information
- Privacy-compliant video processing
- Audit logging for all incidents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- Machine learning model training on historical data
- Integration with IoT sensors
- Mobile app for field personnel
- Advanced predictive analytics
- Multi-language support
- Cloud deployment templates

---

**⚠️ Important**: This system is designed for safety monitoring purposes. Ensure compliance with local privacy laws and regulations when deploying in production environments.
