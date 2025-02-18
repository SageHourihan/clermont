<?php
require 'vendor/autoload.php';  // Load Composer autoloader

use Dotenv\Dotenv;
use WebSocket\Client;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Redis connection
require_once __DIR__ . '/../config/redis.php'; // Include Redis setup

// Retrieve API key
$apiKey = $_ENV['AISSTREAM_API_KEY'];

// Connect to WebSocket
$client = new Client("wss://stream.aisstream.io/v0/stream");

// Prepare message
$message = json_encode([
    "APIKey" => $apiKey,
    "BoundingBoxes" => [
        [[42.32707815, -83.2032273643204], [42.18912815, -83.0412166356796]]
    ]
]);

// Send the message
$client->send($message);

// Listen for messages
while (true) {
    try {
        $incomingMessage = $client->receive();
        echo "Received message: $incomingMessage\n";

        // Store in Redis instead of writing to file
        $cacheKey = 'ais_live_data';
        $cacheTTL = 30; // Store for 30 seconds
        $redis->setex($cacheKey, $cacheTTL, $incomingMessage);

    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
