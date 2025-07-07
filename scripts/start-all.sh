#!/bin/bash

echo "🚀 Starting TSC Prospect Research Application"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "services/api-gateway/node_modules" ]; then
    echo "📦 Installing API Gateway dependencies..."
    cd services/api-gateway && npm install && cd ../..
fi

# Build services
echo "🔨 Building services..."
cd services/api-gateway && npm run build && cd ../..

# Start API Gateway in background
echo "🚀 Starting API Gateway..."
cd services/api-gateway && npm start &
API_GATEWAY_PID=$!
cd ../..

# Wait a moment for API Gateway to start
sleep 3

# Start frontend
echo "🌐 Starting frontend..."
cd frontend && npm run dev

# Cleanup function
cleanup() {
    echo "🛑 Shutting down services..."
    kill $API_GATEWAY_PID 2>/dev/null || true
    exit
}

# Set trap to cleanup on exit
trap cleanup EXIT INT TERM
