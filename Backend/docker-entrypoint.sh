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
echo "MYSQLHOST: ${MYSQLHOST:-not set}"
echo "MYSQLPORT: ${MYSQLPORT:-not set}"
echo "MYSQLDATABASE: ${MYSQLDATABASE:-not set}"
echo "MYSQLUSER: ${MYSQLUSER:-not set}"

if [ -n "$MYSQLHOST" ]; then
    echo "Updating .env with MySQL configuration"
    sed -i "s|^DB_CONNECTION=.*|DB_CONNECTION=mysql|" .env
    sed -i "s|^DB_HOST=.*|DB_HOST=$MYSQLHOST|" .env
    sed -i "s|^DB_PORT=.*|DB_PORT=${MYSQLPORT:-3306}|" .env
    sed -i "s|^DB_DATABASE=.*|DB_DATABASE=$MYSQLDATABASE|" .env
    sed -i "s|^DB_USERNAME=.*|DB_USERNAME=$MYSQLUSER|" .env
    sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=$MYSQLPASSWORD|" .env
    echo "MySQL configuration updated"
else
    echo "MYSQLHOST not set, skipping MySQL configuration"
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

# Clear and cache config/routes
echo "Caching config and routes"
php artisan config:cache --no-interaction
php artisan route:cache --no-interaction

echo "=== docker-entrypoint.sh completed ==="
echo "Executing command: $@"

# Execute the main command
exec "$@"
