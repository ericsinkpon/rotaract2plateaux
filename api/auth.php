<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        
        $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
        $stmt->execute([$username]);
        $admin = $stmt->fetch();
        
        if ($admin && password_verify($password, $admin['password'])) {
            $_SESSION['admin_authenticated'] = true;
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_username'] = $admin['username'];
            echo json_encode(['success' => true, 'message' => 'Connexion réussie']);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Identifiants incorrects']);
        }
        break;

    case 'GET':
        // Vérifier si l'utilisateur est connecté
        if (isset($_SESSION['admin_authenticated']) && $_SESSION['admin_authenticated'] === true) {
            echo json_encode(['authenticated' => true, 'username' => $_SESSION['admin_username']]);
        } else {
            http_response_code(401);
            echo json_encode(['authenticated' => false]);
        }
        break;

    case 'DELETE':
        // Déconnexion
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Déconnexion réussie']);
        break;
}
?>

