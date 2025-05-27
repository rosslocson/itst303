<?php
require 'vendor/autoload.php';

use MongoDB\Client;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$client = new Client($_ENV["MONGODB_URI"]);
$db = $client->quizgame;
$collection = $db->users;

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

$user = $collection->findOne([
    'username' => $username,
    'password' => $password
]);

if ($user) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "fail", "message" => "Invalid credentials"]);
}
?>
