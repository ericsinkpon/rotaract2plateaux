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
            $stmt = $pdo->prepare("SELECT * FROM actualites WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $actualite = $stmt->fetch();
            echo json_encode($actualite ?: ['error' => 'Actualité non trouvée']);
        } else {
            $stmt = $pdo->query("SELECT * FROM actualites ORDER BY date_publication DESC");
            $actualites = $stmt->fetchAll();
            echo json_encode($actualites);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $image = isset($data['image']) ? trim((string) $data['image']) : null;
        $stmt = $pdo->prepare("INSERT INTO actualites (titre, description, contenu, image, date_publication, categorie, auteur) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['titre'],
            $data['description'],
            $data['contenu'] ?? null,
            $image ?: null,
            $data['date_publication'],
            $data['categorie'] ?? null,
            $data['auteur'] ?? 'Par le Club'
        ]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $image = isset($data['image']) ? trim((string) $data['image']) : null;
        $stmt = $pdo->prepare("UPDATE actualites SET titre = ?, description = ?, contenu = ?, image = ?, date_publication = ?, categorie = ?, auteur = ? WHERE id = ?");
        $stmt->execute([
            $data['titre'],
            $data['description'],
            $data['contenu'] ?? null,
            $image,
            $data['date_publication'],
            $data['categorie'] ?? null,
            $data['auteur'] ?? 'Par le Club',
            $data['id']
        ]);
        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? json_decode(file_get_contents('php://input'), true)['id'];
        $stmt = $pdo->prepare("DELETE FROM actualites WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;
}
?>

