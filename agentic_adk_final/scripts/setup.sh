#!/bin/bash

echo "🚀 Setting up Public Safety Monitoring System..."

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create necessary directories
mkdir -p temp/frames
mkdir -p static
mkdir -p logs

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Please edit .env file with your API keys"
fi

# Initialize database
python -c "
import asyncio
from models.database import init_db
asyncio.run(init_db())
print('✅ Database initialized')
"

echo "✅ Setup complete!"
echo "📋 Next steps:"
echo "1. Edit .env file with your API keys"
echo "2. Run: uvicorn main:app --reload"
echo "3. Open: http://localhost:8000"
