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

# 4. Créer l'utilisateur système
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && chown -R $user:$user /home/$user

WORKDIR /var/www/html

# 5. Copier les fichiers de dépendances en premier (optimisation du cache Docker)
COPY composer.json composer.lock ./

# 6. Installer les dépendances sans lancer les scripts Laravel (car le code n'est pas encore là)
RUN composer install --no-dev --no-scripts --no-interaction --optimize-autoloader

# 7. Copier le reste du code
COPY . .

# 8. Maintenant que le code ET les dépendances sont là, on peut nettoyer
RUN php artisan config:clear
RUN php artisan cache:clear
RUN php artisan route:clear
RUN php artisan view:clear

# Optionnel : pré-générer les fichiers de découverte (mais ne pas mettre en cache la config ici)
RUN php artisan package:discover --ansi

# 9. Ajuster les permissions
RUN chown -R $user:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

USER $user

# 10. Commande de démarrage
CMD php artisan serve --host=0.0.0.0 --port=$PORT
