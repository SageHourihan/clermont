<?php
require 'vendor/autoload.php';  // Load Composer autoloader
require '/var/www/html/clermont/config/redis.php'; // Load Redis connection

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

// Function to store ship data by MMSI in Redis
function storeShipData($shipData) {
    global $redis;

    // Get the MMSI (unique ID) of the ship
    $mmsi = $shipData['MetaData']['MMSI'];

    // Store ship data with MMSI as the key and set expiration time of 10 minutes (600 seconds)
    $redis->setex("ship:$mmsi", 600, json_encode($shipData));

    // Optionally, add the MMSI to the active ships set if it's not already present
    if (!$redis->sIsMember("ships:active", $mmsi)) {
        $redis->sAdd("ships:active", $mmsi);
    }

    // Set expiration time for ships:active to 30 seconds
    $redis->expire("ships:active", 30);  // Set expiration for the active set to 30 seconds
    $redis->expire("ship:$mmsi", 600);  // Set expiration for the ship data to 10 minutes (600 seconds)
}


// Listen for messages
while (true) {
    try {
        $incomingMessage = $client->receive();
        echo "Received message: $incomingMessage\n";

        // Assuming incoming message is in JSON format and needs to be decoded
        $data = json_decode($incomingMessage, true);

        // Store the ship data using the storeShipData function
        storeShipData($data);

    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}


