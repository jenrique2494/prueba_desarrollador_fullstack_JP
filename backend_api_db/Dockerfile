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

# Run migrations only on first start. Entrypoint waits for DB, checks for migrations table, runs migrations if needed, then execs the server command.
ENTRYPOINT ["sh", "-c", "echo 'Entrypoint: waiting for DB...'; until php -r \"try{ \$pdo=new PDO(\'mysql:host=\".getenv(\"DB_HOST\").\";port=\".getenv(\"DB_PORT\").\";dbname=\".getenv(\"DB_DATABASE\").\"\', getenv(\"DB_USERNAME\"), getenv(\"DB_PASSWORD\")); exit(0);}catch(Exception \$e){exit(1);}\"; do echo 'DB unavailable - sleeping'; sleep 2; done; if ! php -r \"try{ \$pdo=new PDO(\'mysql:host=\".getenv(\"DB_HOST\").\";port=\".getenv(\"DB_PORT\").\";dbname=\".getenv(\"DB_DATABASE\").\"\', getenv(\"DB_USERNAME\"), getenv(\"DB_PASSWORD\")); \$stmt=\$pdo->query(\\\"SHOW TABLES LIKE 'migrations'\\\"); \$exists=\$stmt && \$stmt->fetch(); exit(\$exists?0:1);}catch(Exception \$e){exit(2);}\"; then echo 'Applying migrations...'; until php artisan migrate --force; do echo 'Waiting for migrations (DB)...'; sleep 3; done; else echo 'Migrations table exists, skipping migrate.'; fi; exec \"$@\""]

# Default command (can be overridden by docker-compose)
CMD ["php", "artisan", "serve", "--host=0.0.0.0"]
