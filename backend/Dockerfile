FROM php:8.3-fpm

# Arguments pour l'utilisateur
ARG user=render
ARG uid=1000

# 1. Installer les dépendances système
RUN apt-get update && apt-get install -y \
    libpq-dev libpng-dev libzip-dev zip unzip git curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. Installer les extensions PHP
RUN docker-php-ext-install pdo_pgsql gd zip

# Configuration PHP pour les gros fichiers
RUN echo "upload_max_filesize=20M" > /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size=20M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "memory_limit=512M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "max_execution_time=300" >> /usr/local/etc/php/conf.d/uploads.ini

# 3. Récupérer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Créer l'utilisateur système
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && chown -R $user:$user /home/$user

WORKDIR /var/www/html

# 5. Installer les dépendances PHP (Optimisé)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --optimize-autoloader

# 6. Copier le reste du code
COPY . .

RUN php artisan config:clear
RUN php artisan route:clear
RUN php artisan view:clear

# Assure-toi que le dossier bootstrap/cache est vide de tout fichier .php
RUN rm -f bootstrap/cache/*.php

# 7. Ajuster les permissions (Crucial)
RUN chown -R $user:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

USER $user

# 8. Commande de démarrage
# On vide les caches au moment où le conteneur démarre réellement
CMD php artisan config:clear && php artisan cache:clear && php artisan serve --host=0.0.0.0 --port=$PORT
