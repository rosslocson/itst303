<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

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

if ($username === '' || $password === '') {
    echo json_encode(["status" => "fail", "message" => "Username and password are required"]);
    exit;
}

// Check if user already exists
$existingUser = $collection->findOne(["username" => $username]);

if ($existingUser) {
    echo json_encode(["status" => "fail", "message" => "Username already taken"]);
    exit;
}

// Insert new user
$collection->insertOne([
    "username" => $username,
    "password" => $password // For real apps, hash the password
]);

echo json_encode(["status" => "success"]);
