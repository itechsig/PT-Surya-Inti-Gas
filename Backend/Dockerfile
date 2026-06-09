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
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Create entrypoint script
RUN echo '#!/bin/bash\n\
if [ ! -f .env ]; then\n\
    cp .env.example .env\n\
fi\n\
# If Railway environment variables are set, override .env database settings\n\
if [ -n "$DB_HOST" ]; then\n\
    sed -i "/^DB_CONNECTION=/c\\DB_CONNECTION=$DB_CONNECTION" .env || echo "DB_CONNECTION=$DB_CONNECTION" >> .env\n\
    sed -i "/^DB_HOST=/c\\DB_HOST=$DB_HOST" .env || echo "DB_HOST=$DB_HOST" >> .env\n\
    sed -i "/^DB_PORT=/c\\DB_PORT=$DB_PORT" .env || echo "DB_PORT=$DB_PORT" >> .env\n\
    sed -i "/^DB_DATABASE=/c\\DB_DATABASE=$DB_DATABASE" .env || echo "DB_DATABASE=$DB_DATABASE" >> .env\n\
    sed -i "/^DB_USERNAME=/c\\DB_USERNAME=$DB_USERNAME" .env || echo "DB_USERNAME=$DB_USERNAME" >> .env\n\
    sed -i "/^DB_PASSWORD=/c\\DB_PASSWORD=$DB_PASSWORD" .env || echo "DB_PASSWORD=$DB_PASSWORD" >> .env\n\
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
