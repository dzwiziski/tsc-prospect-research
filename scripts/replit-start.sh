#!/bin/bash

echo "🚀 Starting TSC Application on Replit"

# Set environment variables for Replit
export NODE_ENV=development
export PORT=3000

# Install all dependencies
echo "📦 Installing dependencies..."
npm install
cd frontend && npm install && cd ..
cd services/api-gateway && npm install && cd ../..

# Build services
echo "🔨 Building API Gateway..."
cd services/api-gateway && npm run build && cd ../..

# Start API Gateway in background
echo "🚀 Starting API Gateway on port 4000..."
cd services/api-gateway && PORT=4000 npm start &
cd ../..

# Wait for API Gateway
sleep 5

# Start frontend on main port
echo "🌐 Starting frontend on port 3000..."
cd frontend && PORT=3000 npm run dev
