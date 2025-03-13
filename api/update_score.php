<?php
header('Content-Type: application/json');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['playerName']) || !isset($data['score']) || !isset($data['level'])) {
    echo json_encode(['error' => 'Données manquantes']);
    exit;
}

try {
    $stmt = $db->prepare('INSERT INTO scores (player_name, score, level, timestamp) 
                         VALUES (:name, :score, :level, NOW())
                         ON DUPLICATE KEY UPDATE 
                         score = IF(:score > score, :score, score),
                         level = :level,
                         timestamp = NOW()');

    $stmt->execute([
        ':name' => $data['playerName'],
        ':score' => $data['score'],
        ':level' => $data['level']
    ]);

    echo json_encode(['success' => true]);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
