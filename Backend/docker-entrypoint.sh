#!/bin/bash
set -e

if [ ! -f .env ]; then
    cp .env.example .env
fi

# Override database config with Railway PostgreSQL variables if available
if [ -n "$PGHOST" ]; then
    sed -i "s|^DB_CONNECTION=.*|DB_CONNECTION=pgsql|" .env
    sed -i "s|^DB_HOST=.*|DB_HOST=$PGHOST|" .env
    sed -i "s|^DB_PORT=.*|DB_PORT=${PGPORT:-5432}|" .env
    sed -i "s|^DB_DATABASE=.*|DB_DATABASE=$POSTGRES_DB|" .env
    sed -i "s|^DB_USERNAME=.*|DB_USERNAME=$PGUSER|" .env
    sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=$PGPASSWORD|" .env
fi

# Only generate a new app key if one wasn't provided via a real environment
# variable (set APP_KEY in the Railway dashboard so it persists across deploys).
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --no-interaction --force
fi

# Make uploaded files (hero slides, product images) reachable at /storage
php artisan storage:link --force || true

# Apply any new migrations (safe to re-run; already-applied ones are skipped)
php artisan migrate --force

# Clear and cache config/routes
php artisan config:cache --no-interaction
php artisan route:cache --no-interaction

# Execute the main command
exec "$@"
