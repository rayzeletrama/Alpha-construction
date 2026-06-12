<?php
try {
    $dsn = "pgsql:host=".getenv('DB_HOST').";port=5432;dbname=".getenv('DB_DATABASE').";";
    $pdo = new PDO($dsn, getenv('DB_USERNAME'), getenv('DB_PASSWORD'));
    if ($pdo) { echo "Connexion Neon OK !"; }
} catch (PDOException $e) {
    echo "Erreur de connexion : " . $e->getMessage();
}
