FROM php:8.4-cli

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd

COPY . .

# Install dependencies
ENV COMPOSER_SOURCE_FALLBACK=1
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Create entrypoint script
RUN echo '#!/bin/bash\n\
if [ ! -f .env ]; then\n\
    cp .env.example .env\n\
fi\n\
# Override database config with Railway PostgreSQL variables if available\n\
if [ -n "$PGHOST" ]; then\n\
    sed -i "s|^DB_CONNECTION=.*|DB_CONNECTION=pgsql|" .env\n\
    sed -i "s|^DB_HOST=.*|DB_HOST=$PGHOST|" .env\n\
    sed -i "s|^DB_PORT=.*|DB_PORT=${PGPORT:-5432}|" .env\n\
    sed -i "s|^DB_DATABASE=.*|DB_DATABASE=$POSTGRES_DB|" .env\n\
    sed -i "s|^DB_USERNAME=.*|DB_USERNAME=$PGUSER|" .env\n\
    sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=$PGPASSWORD|" .env\n\
fi\n\
# Generate application key\n\
php artisan key:generate --no-interaction\n\
\
# Clear and cache config\n\
php artisan config:cache --no-interaction\n\
php artisan route:cache --no-interaction\n\
\
# Execute the main command\n\
exec "$@"' > /usr/local/bin/entrypoint.sh && chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000", "--no-interactive"]
