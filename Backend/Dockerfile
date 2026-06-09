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
# Remove database config from .env to use environment variables\n\
sed -i "/^DB_CONNECTION=/d" .env\n\
sed -i "/^DB_HOST=/d" .env\n\
sed -i "/^DB_PORT=/d" .env\n\
sed -i "/^DB_DATABASE=/d" .env\n\
sed -i "/^DB_USERNAME=/d" .env\n\
sed -i "/^DB_PASSWORD=/d" .env\n\
\
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
