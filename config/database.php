<?php
// Configuration de la base de données

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'root'); // Mot de passe par défaut MAMP
define('DB_NAME', 'rotaract_db');
define('DB_CHARSET', 'utf8mb4');

// Connexion à la base de données
function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        die("Erreur de connexion à la base de données : " . $e->getMessage());
    }
}

// Fonction pour vérifier si les tables existent
function checkTables() {
    try {
        $pdo = getDBConnection();
        $tables = ['admins', 'actions', 'actualites', 'evenements'];
        foreach ($tables as $table) {
            $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
            if ($stmt->rowCount() == 0) {
                return false;
            }
        }
        return true;
    } catch (PDOException $e) {
        return false;
    }
}
?>

