<?php
require 'vendor/autoload.php';  // Load Composer autoloader

use Dotenv\Dotenv;
use WebSocket\Client;

// Load environment variables from .env file
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Retrieve the API key from the environment
$apiKey = $_ENV['AISSTREAM_API_KEY'];

// Connect to the WebSocket server
$client = new Client("wss://stream.aisstream.io/v0/stream");

// Prepare the message
$message = json_encode([
   "APIKey" => $apiKey,  // API Key from environment
    "BoundingBoxes" => [
        [[42.32707815, -83.2032273643204], [42.18912815, -83.0412166356796]]
    ],

//    "FiltersShipMMSI" => ["368207620", "367719770", "211476060"],
//    "FilterMessageTypes" => ["PositionReport"]
]);

// Send the message
$client->send($message);

// Listen for messages from the server
while (true) {
    try {
        // Receive a message from the WebSocket server
        $incomingMessage = $client->receive();
        echo "Received message: $incomingMessage\n";
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
