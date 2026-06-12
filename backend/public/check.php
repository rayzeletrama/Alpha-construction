<?php
header('Content-Type: text/plain');
echo "--- DIAGNOSTIC SYSTEME ---\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Extensions PGSQL: " . (extension_loaded('pdo_pgsql') ? "OK" : "MANQUANTE") . "\n";

echo "\n--- VARIABLES ENV (Test existence) ---\n";
$vars = ['DB_HOST', 'DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD'];
foreach ($vars as $v) {
    echo "$v: " . (getenv($v) ? "DÉFINIE" : "VIDE !!!") . "\n";
}

echo "\n--- TEST CONNEXION DIRECTE ---\n";
$host = getenv('DB_HOST');
$db   = getenv('DB_DATABASE');
$user = getenv('DB_USERNAME');
$pass = getenv('DB_PASSWORD');

try {
    $dsn = "pgsql:host=$host;port=5432;dbname=$db;sslmode=require";
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo "✅ CONNEXION RÉUSSIE À NEON !";
} catch (Exception $e) {
    echo "❌ ERREUR: " . $e->getMessage();
}
