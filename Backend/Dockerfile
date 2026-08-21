# Force cache invalidation - 2026-07-29-v8 - Use docker-entrypoint.sh with Railway env vars
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

# Snapshot the git-committed storage/app/public content (product/gallery/hero-slide/portfolio
# images) to a path outside the future Railway Volume mount point. A Volume mounted at
# storage/app/public shadows whatever was baked into the image at that exact path, so without
# this snapshot there would be no way to restore those files into a freshly-attached empty
# volume - docker-entrypoint.sh reseeds from here on first boot after a volume is attached.
RUN cp -r storage/app/public /app/.storage-seed

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

# Make docker-entrypoint.sh executable
RUN chmod +x docker-entrypoint.sh

EXPOSE 8000

# No CMD here on purpose: Railway assigns a different $PORT per deployment, and a JSON-array
# CMD like ["php", "artisan", "serve", "--port=8080"] can't expand that env var (Docker doesn't
# run exec-form CMD through a shell). docker-entrypoint.sh reads $PORT itself and execs the
# server with the right port - see the bottom of that script.
ENTRYPOINT ["./docker-entrypoint.sh"]
