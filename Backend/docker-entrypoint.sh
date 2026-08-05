#!/bin/bash
set -e

echo "=== Starting docker-entrypoint.sh ==="

if [ ! -f .env ]; then
    echo "Creating .env from .env.example"
    cp .env.example .env
else
    echo ".env file already exists"
fi

# Override database config with Railway MySQL variables if available
echo "Checking MySQL variables..."
echo "DB_HOST: ${DB_HOST:-not set}"
echo "DB_DATABASE: ${DB_DATABASE:-not set}"
echo "DB_USERNAME: ${DB_USERNAME:-not set}"

if [ -n "$DB_HOST" ]; then
    echo "Updating .env with MySQL configuration"
    sed -i "s|^DB_CONNECTION=.*|DB_CONNECTION=mysql|" .env
    sed -i "s|^DB_HOST=.*|DB_HOST=$DB_HOST|" .env
    sed -i "s|^DB_PORT=.*|DB_PORT=${DB_PORT:-3306}|" .env
    sed -i "s|^DB_DATABASE=.*|DB_DATABASE=$DB_DATABASE|" .env
    sed -i "s|^DB_USERNAME=.*|DB_USERNAME=$DB_USERNAME|" .env
    sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=$DB_PASSWORD|" .env
    echo "MySQL configuration updated"
else
    echo "DB_HOST not set, skipping MySQL configuration"
fi

# Override database name if not set (fallback to surya_inti_gas)
if [ -z "$DB_DATABASE" ]; then
    echo "DB_DATABASE not set, using default: surya_inti_gas"
    sed -i "s|^DB_DATABASE=.*|DB_DATABASE=surya_inti_gas|" .env
fi

# Enable secure cookies for production
echo "Enabling secure cookies for production"
sed -i "s|^SESSION_SECURE_COOKIE=.*|SESSION_SECURE_COOKIE=true|" .env

# Clear bootstrap cache to ensure Laravel reads new config
echo "Clearing bootstrap cache"
rm -rf bootstrap/cache/*.php

# Create storage link for public access to storage files
echo "Creating storage link"
php artisan storage:link

# Ensure gallery folder exists for photo uploads
echo "Ensuring gallery folder exists"
mkdir -p storage/app/public/gallery

# Copy product images from frontend if they don't exist
echo "Checking product images"
if [ ! -f "storage/app/public/products/acetylene-Acetylene_fix.webp" ]; then
    echo "Copying product images from frontend"
    mkdir -p storage/app/public/products
    # Copy individual images that are needed
    cp ../Frontend/public/images/products/*.webp storage/app/public/products/ 2>/dev/null || true
    # Copy and rename files to match seeder expectations (using cp instead of mv for files used multiple times)
    cp storage/app/public/products/Acetylene_fix.webp storage/app/public/products/acetylene-Acetylene_fix.webp 2>/dev/null || true
    cp storage/app/public/products/Oxygen_Fix.webp storage/app/public/products/oxygen-Oxygen_Fix.webp 2>/dev/null || true
    cp storage/app/public/products/Nitrogen_Fix.webp storage/app/public/products/nitrogen-Nitrogen_Fix.webp 2>/dev/null || true
    cp storage/app/public/products/Argon_Fix.webp storage/app/public/products/argon-Argon_Fix.webp 2>/dev/null || true
    cp storage/app/public/products/CO2_Fix.webp storage/app/public/products/carbon-dioxide-CO2_Fix.webp 2>/dev/null || true
    cp storage/app/public/products/Hidrogen_Fix.webp storage/app/public/products/hydrogen-Hidrogen_Fix.webp 2>/dev/null || true
    cp storage/app/public/products/Helium_Fix.webp storage/app/public/products/helium-Helium_Fix.webp 2>/dev/null || true
    cp storage/app/public/products/SF6_Fix.webp storage/app/public/products/sulfur-hexaflouride-SF6_Fix.webp 2>/dev/null || true
    cp storage/app/public/products/Mixed_Gas_Fix.webp storage/app/public/products/mixed-gas-Mixed_Gas_Fix.webp 2>/dev/null || true
    cp storage/app/public/products/Special_gas_.webp storage/app/public/products/color-code-special-Special_gas_.webp 2>/dev/null || true
    cp storage/app/public/products/Oxygen_Fix.webp storage/app/public/products/color-code-medical-Oxygen_Fix.webp 2>/dev/null || true
    cp storage/app/public/products/Cryogenic&Valve.webp storage/app/public/products/cryogenic-gas-valve-Cryogenic&Valve.webp 2>/dev/null || true
    cp storage/app/public/products/Gas_Regulator_For_Cutting.webp storage/app/public/products/gas-regulator-laser-Gas_Regulator_For_Cutting.webp 2>/dev/null || true
    cp storage/app/public/products/High_Pressure_Regulator.webp storage/app/public/products/high-pressure-regulator-High_Pressure_Regulator.webp 2>/dev/null || true
    cp storage/app/public/products/High_Pressure_Gas_Valve.webp storage/app/public/products/high-pressure-gas-valve-High_Pressure_Gas_Valve.webp 2>/dev/null || true
    cp storage/app/public/products/GDMS.webp storage/app/public/products/gdms-systems-GDMS.webp 2>/dev/null || true
    cp storage/app/public/products/ISO_Tank.webp storage/app/public/products/cryogenic-iso-tank-ISO_Tank.webp 2>/dev/null || true
    cp storage/app/public/products/Road_tank.webp storage/app/public/products/cryogenic-road-tank-Road_tank.webp 2>/dev/null || true
    cp storage/app/public/products/Vertical_Tank.webp storage/app/public/products/vertical-storage-tank-Vertical_Tank.webp 2>/dev/null || true
    cp storage/app/public/products/Microbulk_.webp storage/app/public/products/microbulk-tank-Microbulk_.webp 2>/dev/null || true
    cp storage/app/public/products/VGL.webp storage/app/public/products/vessel-gas-liquid-VGL.webp 2>/dev/null || true
    cp storage/app/public/products/Storage_Tank_Gas.webp storage/app/public/products/storage-tank-gas-supply-Storage_Tank_Gas.webp 2>/dev/null || true
    cp storage/app/public/products/Microbulk_Gas_Supply.webp storage/app/public/products/microbulk-gas-supply-Microbulk_Gas_Supply.webp 2>/dev/null || true
    cp storage/app/public/products/Craddle_4x4_fixed.webp storage/app/public/products/assist-gas-cradle-4x4-Assist_Gas_Supply.webp 2>/dev/null || true
    cp storage/app/public/products/Oxygen_Fix.webp storage/app/public/products/refilling-Oxygen_Fix.webp 2>/dev/null || true
    
    # Add backward compatibility for old database image names
    cp storage/app/public/products/Acetylene_fix.webp storage/app/public/products/acetylene-Acetylene-optimized.webp 2>/dev/null || true
    cp storage/app/public/products/Acetylene_fix.webp storage/app/public/products/color-code-acetylene-Acetylene-optimized.webp 2>/dev/null || true
    cp storage/app/public/products/Oxygen_Fix.webp storage/app/public/products/oxygen-Oxygen-optimized.webp 2>/dev/null || true
    cp storage/app/public/products/Oxygen_Fix.webp storage/app/public/products/color-code-medical-Medical_Gas_Cylinder.webp 2>/dev/null || true
    cp storage/app/public/products/Nitrogen_Fix.webp storage/app/public/products/nitrogen-Nitrogen-optimized.webp 2>/dev/null || true
    cp storage/app/public/products/Argon_Fix.webp storage/app/public/products/argon-Argon-optimized.webp 2>/dev/null || true
    cp storage/app/public/products/Hidrogen_Fix.webp storage/app/public/products/hydrogen-Hidrogen-optimized.webp 2>/dev/null || true
    cp storage/app/public/products/Helium_Fix.webp storage/app/public/products/helium-Helium-optimized.webp 2>/dev/null || true
    cp storage/app/public/products/SF6_Fix.webp storage/app/public/products/sulfur-hexaflouride-Sulfur_Hexaflouride.webp 2>/dev/null || true
    cp storage/app/public/products/Mixed_Gas_Fix.webp storage/app/public/products/mixed-gas-Mix_gas.webp 2>/dev/null || true
    cp storage/app/public/products/Oxygen_Fix.webp storage/app/public/products/refilling-Refilling.webp 2>/dev/null || true
    cp storage/app/public/products/color-code-special-Special_gas_.webp storage/app/public/products/Special_gas_.webp 2>/dev/null || true
    cp storage/app/public/products/color-code-industrial-20260618_134406.webp storage/app/public/products/20260618_134406.webp 2>/dev/null || true
fi

# Only generate a new app key if one wasn't provided via a real environment
# variable (set APP_KEY in the Railway dashboard so it persists across deploys).
if [ -z "$APP_KEY" ]; then
    echo "Generating APP_KEY"
    php artisan key:generate --no-interaction --force
else
    echo "APP_KEY already set"
fi

# Make uploaded files (hero slides, product images) reachable at /storage
echo "Creating storage link"
php artisan storage:link --force || true

# Apply any new migrations (safe to re-run; already-applied ones are skipped)
echo "Running migrations"
php artisan migrate --force

# Clear and cache config/routes AFTER .env is updated
echo "Caching config and routes"
php artisan config:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache

echo "=== docker-entrypoint.sh completed ==="
echo "Executing command: $@"

# Execute the main command
exec "$@"
