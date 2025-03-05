<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/constants.php';  // Load the constants

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

// Function to get the latest bounding box from cache
function getLatestBoundingBox($cacheService) {
    $updatedBounds = $cacheService->fetch("map_bounds");
    if ($updatedBounds) {
        return json_decode($updatedBounds, true);
    }
    // Default bounding box if no updates are found
    return [[42.32707815, -83.2032273643204], [42.18912815, -83.0412166356796]];
}

// Send initial bounding box message
$boundingBoxes = getLatestBoundingBox($cacheService);
$message = json_encode([
    "APIKey" => $apiKey,
    "BoundingBoxes" => [$boundingBoxes]
]);

$webSocketClient->sendMessage($message);
echo "Sent initial bounding box to WebSocket.\n";

// Listen for incoming messages
while (true) {
    try {
        // Check if bounds have changed
        $newBoundingBoxes = getLatestBoundingBox($cacheService);
        if ($newBoundingBoxes !== $boundingBoxes) {
            $boundingBoxes = $newBoundingBoxes; // Update stored bounds

            // Construct and send the updated WebSocket message
            $message = json_encode([
                "APIKey" => $apiKey,
                "BoundingBoxes" => [$boundingBoxes]
            ]);

            // Log the sent message
            echo "Sending WebSocket message: " . $message . "\n";
            
            $webSocketClient->sendMessage($message);
            echo "Sent updated bounds to WebSocket: " . json_encode($boundingBoxes) . "\n\n";
        }

        // Receive a message from the WebSocket server
        $incomingMessage = $webSocketClient->receiveMessage();
        // echo "Received message: $incomingMessage\n";

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

            echo "Stored data in Memcache for MMSI: $mmsi\n";
        }

        // Sleep to prevent excessive CPU usage
        sleep(3);
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
