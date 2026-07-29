# Force cache invalidation - 2026-07-29-v4
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

# Generate app key
RUN php artisan key:generate --no-interaction --force || true

# Clear and cache config
RUN php artisan config:cache --no-interaction || true
RUN php artisan route:cache --no-interaction || true

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
