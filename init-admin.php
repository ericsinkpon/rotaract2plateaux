<?php
// Script d'initialisation pour créer l'administrateur
// À exécuter une seule fois après la création de la base de données

require_once 'config/database.php';

try {
    $pdo = getDBConnection();
    
    // Vérifier si l'admin existe déjà
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE username = 'admin'");
    $stmt->execute();
    $count = $stmt->fetchColumn();
    
    if ($count == 0) {
        // Créer l'administrateur par défaut
        // Mot de passe : admin123
        $password = password_hash('admin123', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO admins (username, password, email) VALUES (?, ?, ?)");
        $stmt->execute(['admin', $password, 'rotaractdeuxplateaux@gmail.com']);
        
        echo "Administrateur créé avec succès !<br>";
        echo "Nom d'utilisateur : admin<br>";
        echo "Mot de passe : admin123<br>";
        echo "<strong>Important : Changez ce mot de passe après la première connexion !</strong>";
    } else {
        echo "L'administrateur existe déjà.";
    }
    
} catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage();
}
?>

