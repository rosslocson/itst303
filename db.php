<?php
require 'vendor/autoload.php'; // If using Composer

$uri = getenv('MONGODB_URI'); // Use .env file or Apache env vars
$client = new MongoDB\Client($uri);

$database = $client->quiz_game;
$questionsCollection = $database->questions;
$responsesCollection = $database->responses;
?>
