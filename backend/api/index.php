<?php

// 1. Forcer le dossier de stockage en /tmp (Seul endroit inscriptible sur Vercel)
putenv('APP_STORAGE=/tmp');

// 2. Créer les dossiers nécessaires au démarrage
$paths = [
    '/tmp/framework/views',
    '/tmp/framework/cache',
    '/tmp/framework/sessions',
];
foreach ($paths as $path) {
    if (!is_dir($path)) {
        mkdir($path, 0777, true);
    }
}

// 3. Charger Laravel
require __DIR__ . '/../public/index.php';
