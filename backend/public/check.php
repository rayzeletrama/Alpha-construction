<?php
echo "PHP Version: " . phpversion() . "<br>";
try {
    $pdo = new PDO(
        "pgsql:host=".getenv('DB_HOST').";port=5432;dbname=".getenv('DB_DATABASE'),
        getenv('DB_USERNAME'),
        getenv('DB_PASSWORD'),
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo "✅ CONNEXION NEON RÉUSSIE !";
} catch (Exception $e) {
    echo "❌ ÉCHEC CONNEXION : " . $e->getMessage();
}
