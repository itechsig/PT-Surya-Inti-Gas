# Force cache invalidation - 2026-07-29-v3
FROM php:8.4-cli

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libcurl4-openssl-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd curl

# Copy application files
COPY . .

# Set permissions for directories
RUN mkdir -p bootstrap/cache \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
 && chmod -R 775 bootstrap storage

# Install dependencies
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer config -g repo.packagist composer https://packagist.org && \
    composer install --no-interaction --optimize-autoloader

# Copy .env.example to .env
RUN cp .env.example .env || true

# Setup environment - will be overridden by Railway env vars
RUN if [ -n "$MYSQLHOST" ]; then \
    sed -i "s|^DB_CONNECTION=.*|DB_CONNECTION=mysql|" .env || true; \
    sed -i "s|^DB_HOST=.*|DB_HOST=$MYSQLHOST|" .env || true; \
    sed -i "s|^DB_PORT=.*|DB_PORT=${MYSQLPORT:-3306}|" .env || true; \
    sed -i "s|^DB_DATABASE=.*|DB_DATABASE=$MYSQLDATABASE|" .env || true; \
    sed -i "s|^DB_USERNAME=.*|DB_USERNAME=$MYSQLUSER|" .env || true; \
    sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=$MYSQLPASSWORD|" .env || true; \
    fi

# Generate app key
RUN php artisan key:generate --no-interaction --force || true

# Run migrations
RUN php artisan migrate --force || true

# Clear and cache config
RUN php artisan config:cache --no-interaction || true
RUN php artisan route:cache --no-interaction || true

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
