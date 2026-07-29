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

# Enable secure cookies for production
echo "Enabling secure cookies for production"
sed -i "s|^SESSION_SECURE_COOKIE=.*|SESSION_SECURE_COOKIE=true|" .env

# Clear bootstrap cache to ensure Laravel reads new config
echo "Clearing bootstrap cache"
rm -rf bootstrap/cache/*.php

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
