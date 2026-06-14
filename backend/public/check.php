<?php
header('Content-Type: text/plain');

$pass = getenv('DB_PASSWORD');
echo "Longueur du mot de passe : " . strlen($pass) . " caractères\n";
echo "Premier caractère : " . substr($pass, 0, 1) . "\n";
echo "Dernier caractère : " . substr($pass, -1) . "\n";

$host = getenv('DB_HOST');
$db   = getenv('DB_DATABASE');
$user = getenv('DB_USERNAME');

try {
    // Tentative avec SSL forcé différemment pour PostgreSQL
    $dsn = "pgsql:host=$host;port=5432;dbname=$db;sslmode=require";
    echo "DSN utilisé : $dsn\n";

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::VERSION => PDO::ERRMODE_EXCEPTION
    ]);
    echo "✅ CONNEXION RÉUSSIE !";
} catch (Exception $e) {
    echo "❌ ÉCHEC : " . $e->getMessage();
}
