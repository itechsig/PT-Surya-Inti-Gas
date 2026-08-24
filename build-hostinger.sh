#!/bin/bash

# Build script for Hostinger deployment
# This script builds React frontend and copies it to Laravel public folder

echo "🔨 Starting build process for Hostinger deployment..."

# Step 1: Build React frontend
echo "📦 Building React frontend..."
cd Frontend
npm install
npm run build

# Step 2: Copy React build to Laravel public folder
echo "📋 Copying React build to Laravel public folder..."
cd ..
rm -rf Backend/public/*
cp -r Frontend/dist/* Backend/public/

# Step 3: Copy backend index.php back if it was overwritten
echo "🔧 Ensuring Laravel entry point exists..."
if [ ! -f "Backend/public/index.php" ]; then
    cp Backend/public/index.php.backup Backend/public/index.php 2>/dev/null || echo "⚠️  Warning: index.php not found in backup"
fi

echo "✅ Build completed successfully!"
echo "📁 Output: Backend/public/"
echo "🚀 Ready for Hostinger deployment"