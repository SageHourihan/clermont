<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/constants.php';  // Load the constant

use Dotenv\Dotenv;
use Services\WebSocketClient;

// Load environment variables from .env file
$dotenv = Dotenv::createImmutable(PROJECT_ROOT);
$dotenv->load();

// Retrieve the API key from the environment
$apiKey = $_ENV['AISSTREAM_API_KEY'];

$webSocketClient = new WebSocketClient($apiKey);

$message = json_encode([
    "APIKey" => $apiKey,  // API Key from environment
    "BoundingBoxes" => [
        [[42.32707815, -83.2032273643204], [42.18912815, -83.0412166356796]]
    ]
]);

$webSocketClient->sendMessage($message);

while(true) {
    $incomingMessage = $webSocketClient->receiveMessage();

    echo "Message received: $incomingMessage\n";
}
