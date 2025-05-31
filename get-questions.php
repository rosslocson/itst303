<?php
require 'vendor/autoload.php';
use MongoDB\Client;

header("Content-Type: application/json");

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$client = new Client($_ENV["MONGODB_URI"]);
$collection = $client->quizgame->questions;

$questions = $collection->aggregate([['$sample' => ['size' => 10]]]);
$output = [];

foreach ($questions as $q) {
    $output[] = [
        "_id" => (string)$q->_id,
        "question" => $q->question,
        "choices" => $q->choices,
        "answer" => $q->answer
    ];
}

echo json_encode($output);
