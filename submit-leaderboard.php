
<?php
// submit-leaderboard.php
require 'vendor/autoload.php';
use MongoDB\Client;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Get JSON input
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    // Validate input
    if (!isset($data['name']) || !isset($data['score'])) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Missing required fields: name and score"
        ]);
        exit;
    }

    $name = trim($data['name']);
    $score = (int)$data['score'];

    // Validate data
    if (empty($name)) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Name cannot be empty"
        ]);
        exit;
    }

    if ($score < 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false, 
            "message" => "Score must be a positive number"
        ]);
        exit;
    }

    // Load environment variables
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    // Connect to MongoDB
    $client = new Client($_ENV["MONGODB_URI"]);
    $collection = $client->quizgame->leaderboard;

    // Insert the score
    $insertOneResult = $collection->insertOne([
        'name' => $name,
        'score' => $score,
        'submitted_at' => new MongoDB\BSON\UTCDateTime()
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Score submitted successfully!",
        "inserted_id" => (string)$insertOneResult->getInsertedId(),
        "data" => [
            "name" => $name,
            "score" => $score
        ]
    ]);

} catch (MongoDB\Driver\Exception\Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}
?>