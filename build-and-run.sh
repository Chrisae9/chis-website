#!/bin/bash

# Build and Run Script for AI Blog
# This script builds the app, waits for completion, then brings up the production server

set -e  # Exit on any error

echo "🏗️  Starting build process..."

# Build the application
echo "📦 Building the application..."
docker compose --profile build up app-build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    
    # Clean up build container
    echo "🧹 Cleaning up build container..."
    docker compose --profile build down
else
    echo "❌ Build failed!"
    # Clean up failed build container
    docker compose --profile build down
    exit 1
fi

echo "🛑 Taking down any existing containers..."
docker compose down

echo "🚀 Starting production server in detached mode..."
docker compose --profile prod up -d app

echo "🎉 Application is now running in the background!"
echo "📍 Use 'docker compose --profile prod down' to stop the server"
echo "📊 Use 'docker compose --profile prod logs app -f' to view logs"
