<?php
// get-leaderboard.php
require 'vendor/autoload.php';
use MongoDB\Client;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Load environment variables
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    // Connect to MongoDB using environment variable
    $client = new Client($_ENV["MONGODB_URI"]);
    $collection = $client->quizgame->leaderboard;

    // Get top 10 scores, sorted by score (descending)
    $cursor = $collection->find(
        [], 
        [
            'sort' => ['score' => -1], 
            'limit' => 10
        ]
    );
    
    $leaderboard = [];

    foreach ($cursor as $doc) {
        $leaderboard[] = [
            'name' => $doc['name'],
            'score' => $doc['score'],
            'submitted_at' => isset($doc['submitted_at']) 
                ? $doc['submitted_at']->toDateTime()->format('Y-m-d H:i:s') 
                : null
        ];
    }

    echo json_encode($leaderboard);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Database connection failed: " . $e->getMessage()
    ]);
}
?>
