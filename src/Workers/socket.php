<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/constants.php';  // Load the constant

use Dotenv\Dotenv;
use Services\WebSocketClient;
use Services\AISDataService;
use Services\CacheService;

// Load environment variables from .env file
$dotenv = Dotenv::createImmutable(PROJECT_ROOT);
$dotenv->load();

// Retrieve the API key from the environment
$apiKey = $_ENV['AISSTREAM_API_KEY'];

// Create instances of the services
$webSocketClient = new WebSocketClient($apiKey);
$aisDataService = new AISDataService();
$cacheService = new CacheService();

// Define the message to send to AIS Stream
$message = json_encode([
    "APIKey" => $apiKey,
    "BoundingBoxes" => [
        [[42.32707815, -83.2032273643204], [42.18912815, -83.0412166356796]]
    ]
]);

// Send the message to the WebSocket
$webSocketClient->sendMessage($message);

// Listen for incoming messages
while (true) {
    try {
        // Receive a message from the WebSocket server
        $incomingMessage = $webSocketClient->receiveMessage();
        echo "Received message: $incomingMessage\n";

        // Process the incoming message
        $processedData = $aisDataService->processIncomingData($incomingMessage);

        if ($processedData) {
            $mmsi = $processedData['mmsi'];

            // Store the processed data in Memcached
            $cacheService->storeShipData($mmsi, $incomingMessage);

            // Get the list of active ships from cache
            $activeShips = $cacheService->getActiveShips();

            // Initialize the list if it doesn't exist
            if ($activeShips === false) {
                $activeShips = [];
            }

            // Add the MMSI if it's not already in the list
            if (!in_array($mmsi, $activeShips)) {
                $activeShips[] = $mmsi;
                $cacheService->storeActiveShipsList($activeShips); // Store the updated active ships list
            }

            echo "Stored data in memcache\n";
        }
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
