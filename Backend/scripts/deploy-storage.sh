#!/bin/bash

# Deployment script for Railway to ensure storage link exists
# This script creates the symbolic link for public storage access

echo "Setting up storage link for Railway deployment..."

# Create storage directory if it doesn't exist
mkdir -p storage/app/public

# Create public directory if it doesn't exist  
mkdir -p public

# Remove existing storage link if it exists
if [ -L "public/storage" ]; then
    rm public/storage
fi

# Create the symbolic link
ln -sf ../storage/app/public public/storage

echo "Storage link created successfully"
ls -la public/storage