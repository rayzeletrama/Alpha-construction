<?php
$host = getenv('DB_HOST');
$db   = getenv('DB_DATABASE');
$user = getenv('DB_USERNAME');
$pass = getenv('DB_PASSWORD');

try {
    $conn = "pgsql:host=$host;port=5432;dbname=$db;sslmode=require";
    $pdo = new PDO($conn, $user, $pass);
    echo "✅ CONNEXION RÉUSSIE !";
} catch (PDOException $e) {
    echo "❌ ÉCHEC : " . $e->getMessage();
}
