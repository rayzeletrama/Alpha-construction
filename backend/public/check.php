<?php
$transport = "tls";
$host = "smtp.gmail.com";
$port = 587; // On teste le port 587 qui est souvent plus simple que 465
$user = getenv('MAIL_USERNAME');
$pass = getenv('MAIL_PASSWORD');

echo "Tentative de connexion à Gmail SMTP...\n";
$connection = @fsockopen($host, $port, $errno, $errstr, 5);

if (!$connection) {
    echo "❌ PORT BLOQUÉ : $errstr ($errno)";
} else {
    echo "✅ PORT OUVERT ! Le problème vient donc de tes identifiants ou de la config Laravel.";
    fclose($connection);
}
