<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Diagnostic de Connexion Alpha</h1>";

$host = getenv('DB_HOST');
$db   = getenv('DB_DATABASE');
$user = getenv('DB_USERNAME');
$pass = getenv('DB_PASSWORD');

echo "Tentative de connexion à : $host ...<br>";

try {
    $dsn = "pgsql:host=$host;port=5432;dbname=$db;";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    $pdo = new PDO($dsn, $user, $pass, $options);

    echo "<b style='color:green'>✅ CONNÉXION RÉUSSIE À NEON !</b><br>";

    $query = $pdo->query("SELECT name FROM tenants LIMIT 1");
    $tenant = $query->fetch();

    if ($tenant) {
        echo "✅ Données trouvées : Boutique " . $tenant['name'] . " est présente.";
    } else {
        echo "⚠️ La table 'tenants' est vide. As-tu lancé le seeder ?";
    }

} catch (\PDOException $e) {
    echo "<b style='color:red'>❌ ÉCHEC DE CONNEXION :</b> " . $e->getMessage();
}
