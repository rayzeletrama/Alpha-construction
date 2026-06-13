<?php

// 1. Forcer Laravel à utiliser /tmp (le seul dossier accessible en écriture sur Vercel)
$storagePath = '/tmp/storage';
putenv("APP_STORAGE={$storagePath}");

// 2. Créer l'arborescence complète pour éviter que Laravel ne cherche à écrire ailleurs
if (!is_dir($storagePath)) {
    mkdir($storagePath, 0777, true);
    mkdir($storagePath . '/framework/views', 0777, true);
    mkdir($storagePath . '/framework/cache', 0777, true);
    mkdir($storagePath . '/framework/sessions', 0777, true);
    mkdir($storagePath . '/app/public', 0777, true);
}

// 3. Charger le point d'entrée réel
require __DIR__ . '/../public/index.php';
