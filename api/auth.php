<?php
header('Content-Type: application/json');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? '';

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['error' => 'Données manquantes']);
    exit;
}

try {
    switch ($action) {
        case 'register':
            $stmt = $db->prepare('INSERT INTO users (username, password, created_at) VALUES (:username, :password, NOW())');
            $stmt->execute([
                ':username' => $data['username'],
                ':password' => password_hash($data['password'], PASSWORD_DEFAULT)
            ]);
            echo json_encode(['success' => true, 'message' => 'Compte créé avec succès']);
            break;

        case 'login':
            $stmt = $db->prepare('SELECT * FROM users WHERE username = :username');
            $stmt->execute([':username' => $data['username']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($data['password'], $user['password'])) {
                // Récupérer la progression
                $stmt = $db->prepare('SELECT * FROM scores WHERE player_name = :username');
                $stmt->execute([':username' => $data['username']]);
                $progress = $stmt->fetch(PDO::FETCH_ASSOC);

                echo json_encode([
                    'success' => true,
                    'username' => $user['username'],
                    'progress' => $progress
                ]);
            } else {
                echo json_encode(['error' => 'Identifiants incorrects']);
            }
            break;

        default:
            echo json_encode(['error' => 'Action non valide']);
    }
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
