<?php
require 'vendor/autoload.php';
use MongoDB\Client;

header("Content-Type: application/json");

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$data = json_decode(file_get_contents("php://input"), true);

$client = new Client($_ENV["MONGODB_URI"]);
$collection = $client->quizgame->responses;

$collection->insertOne([
    "questionId" => $data["questionId"],
    "answer" => $data["answer"],
    "correct" => $data["correct"],
    "timestamp" => new MongoDB\BSON\UTCDateTime(strtotime($data["timestamp"]) * 1000)
]);

echo json_encode(["status" => "success"]);
