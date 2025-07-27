#!/bin/bash

echo "🚀 Starting Public Safety Monitoring System..."

# Activate virtual environment
source venv/bin/activate

# Start the application
uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level info
