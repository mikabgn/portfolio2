<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    $stmt = $db->query('SELECT player_name, score, level, timestamp 
                       FROM scores 
                       ORDER BY score DESC 
                       LIMIT 10');

    $ranking = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($ranking);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
