<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once '../config/database.php';

// Vérifier l'authentification pour les méthodes autres que GET
$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET' && (!isset($_SESSION['admin_authenticated']) || $_SESSION['admin_authenticated'] !== true)) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

$pdo = getDBConnection();

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Récupérer une action spécifique
            $stmt = $pdo->prepare("SELECT * FROM actions WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $action = $stmt->fetch();
            echo json_encode($action ?: ['error' => 'Action non trouvée']);
        } else {
            // Récupérer toutes les actions
            $stmt = $pdo->query("SELECT * FROM actions ORDER BY date_activite DESC");
            $actions = $stmt->fetchAll();
            echo json_encode($actions);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $image = isset($data['image']) ? trim((string) $data['image']) : null;
        $stmt = $pdo->prepare("INSERT INTO actions (titre, description, image, date_activite, montant_collecte, montant_objectif, categorie) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['titre'],
            $data['description'],
            $image,
            $data['date_activite'],
            $data['montant_collecte'] ?? 0,
            $data['montant_objectif'] ?? 0,
            $data['categorie'] ?? null
        ]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $image = isset($data['image']) ? trim((string) $data['image']) : null;
        $stmt = $pdo->prepare("UPDATE actions SET titre = ?, description = ?, image = ?, date_activite = ?, montant_collecte = ?, montant_objectif = ?, categorie = ? WHERE id = ?");
        $stmt->execute([
            $data['titre'],
            $data['description'],
            $image,
            $data['date_activite'],
            $data['montant_collecte'] ?? 0,
            $data['montant_objectif'] ?? 0,
            $data['categorie'] ?? null,
            $data['id']
        ]);
        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? json_decode(file_get_contents('php://input'), true)['id'];
        $stmt = $pdo->prepare("DELETE FROM actions WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;
}
?>

