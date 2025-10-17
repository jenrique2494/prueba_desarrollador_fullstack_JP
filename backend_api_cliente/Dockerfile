FROM php:8.2-fpm-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    build-base

# Instalar extensiones PHP
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install gd
RUN docker-php-ext-install zip

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin --filename=composer

WORKDIR /app

# Copiar archivos del proyecto
COPY . .

# Instalar dependencias de Composer
RUN composer install --no-interaction --optimize-autoloader

# Copiar .env.example a .env si no existe
RUN [ -f .env ] || cp .env.example .env

# Generar APP_KEY
RUN php artisan key:generate --force

# Dar permisos a storage
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8000

# Ejecutar servidor
CMD ["php", "artisan", "serve", "--host=0.0.0.0"]
