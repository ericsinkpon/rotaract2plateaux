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
            $stmt = $pdo->prepare("SELECT * FROM evenements WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $evenement = $stmt->fetch();
            echo json_encode($evenement ?: ['error' => 'Événement non trouvé']);
        } else {
            $stmt = $pdo->query("SELECT * FROM evenements ORDER BY date_evenement ASC");
            $evenements = $stmt->fetchAll();
            echo json_encode($evenements);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $image = isset($data['image']) ? trim((string) $data['image']) : null;
        $stmt = $pdo->prepare("INSERT INTO evenements (titre, description, image, date_evenement, heure, lieu) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['titre'],
            $data['description'],
            $image,
            $data['date_evenement'],
            $data['heure'] ?? null,
            $data['lieu']
        ]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $image = isset($data['image']) ? trim((string) $data['image']) : null;
        $stmt = $pdo->prepare("UPDATE evenements SET titre = ?, description = ?, image = ?, date_evenement = ?, heure = ?, lieu = ? WHERE id = ?");
        $stmt->execute([
            $data['titre'],
            $data['description'],
            $image,
            $data['date_evenement'],
            $data['heure'] ?? null,
            $data['lieu'],
            $data['id']
        ]);
        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? json_decode(file_get_contents('php://input'), true)['id'];
        $stmt = $pdo->prepare("DELETE FROM evenements WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;
}
?>

