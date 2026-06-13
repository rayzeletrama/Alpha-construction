FROM php:8.3-fpm

# Arguments pour les permissions (comme en local)
ARG user=devuser
ARG uid=1000

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    libpq-dev libpng-dev libzip-dev zip unzip git curl nginx

# Installer les extensions PHP indispensables
RUN docker-php-ext-install pdo_pgsql gd zip

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Créer l'utilisateur système
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && chown -R $user:$user /home/$user

WORKDIR /var/www/html

# Copier le code
COPY . .

# Donner les droits sur le stockage
RUN chown -R $user:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Passer sur l'utilisateur
USER $user

# Commande de démarrage pour Render
# On utilise l'artisan serve car c'est le plus simple pour le plan gratuit Render
CMD php artisan serve --host=0.0.0.0 --port=$PORT
