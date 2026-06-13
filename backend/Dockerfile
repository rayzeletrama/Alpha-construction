FROM php:8.3-fpm

# Arguments pour l'utilisateur
ARG user=render
ARG uid=1000

# 1. Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. Installer les extensions PHP
RUN docker-php-ext-install pdo_pgsql gd zip

# 3. Récupérer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Créer l'utilisateur système pour Render
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && chown -R $user:$user /home/$user

# 5. Définir le dossier de travail
WORKDIR /var/www/html

# 6. Copier le code source (sans le dossier vendor qui est ignoré)
COPY . .

RUN php artisan config:clear
RUN php artisan route:clear

# 7. INSTALLER LES DÉPENDANCES PHP (C'est l'étape qui manquait !)
# On lance composer en mode production
RUN composer install --no-dev --optimize-autoloader --no-interaction

# 8. Ajuster les permissions pour Laravel
RUN chown -R $user:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# 9. Passer sur l'utilisateur non-root
USER $user

# 10. Commande de démarrage
CMD php artisan serve --host=0.0.0.0 --port=$PORT
