FROM php:8.3-fpm

ARG user
ARG uid

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    libpq-dev libpng-dev libzip-dev zip unzip git curl

# Installer les extensions PHP
RUN docker-php-ext-install pdo_pgsql gd zip

# --- AJOUTE CETTE LIGNE POUR INSTALLER COMPOSER ---
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Créer l'utilisateur
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

WORKDIR /var/www/html

COPY . .
RUN chown -R $user:$user /var/www/html

USER $user

EXPOSE 80
