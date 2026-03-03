<?php
// API publique pour récupérer les données (sans authentification)
header('Content-Type: application/json; charset=utf-8');
require_once '../config/database.php';

$type = $_GET['type'] ?? 'all';
$pdo = getDBConnection();

try {
    switch ($type) {
        case 'actions':
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
            $query = "SELECT * FROM actions ORDER BY date_activite DESC";
            if ($limit) {
                $query .= " LIMIT " . max(1, min($limit, 100));
            }
            $stmt = $pdo->query($query);
            echo json_encode($stmt->fetchAll());
            break;
            
        case 'actualites':
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
            $query = "SELECT * FROM actualites ORDER BY date_publication DESC";
            if ($limit) {
                $query .= " LIMIT $limit";
            }
            $stmt = $pdo->query($query);
            echo json_encode($stmt->fetchAll());
            break;
            
        case 'all':
        default:
            $actions = $pdo->query("SELECT * FROM actions ORDER BY date_activite DESC")->fetchAll();
            $actualites = $pdo->query("SELECT * FROM actualites ORDER BY date_publication DESC")->fetchAll();
            echo json_encode([
                'actions' => $actions,
                'actualites' => $actualites
            ]);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>

