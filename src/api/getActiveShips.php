<?php

// Include autoload and constants for autoloading the service classes and dotenv
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/constants.php';  // Load the constant

use Services\CacheService;

// Load environment variables from .env file
$dotenv = Dotenv\Dotenv::createImmutable(PROJECT_ROOT);
$dotenv->load();

// Create an instance of CacheService
$cacheService = new CacheService();

function getData($cacheService) {
    // Get the list of active ships (an array of MMSIs)
    $activeShips = $cacheService->getActiveShips();

    // If there are no active ships, return an empty array
    if ($activeShips === false || !is_array($activeShips)) {
        $activeShips = [];
    }

    $shipData = [];

    // Retrieve each ship's data from Memcached
    foreach ($activeShips as $mmsi) {
        $shipInfo = $cacheService->getShipData($mmsi);

        if ($shipInfo !== false) {
            $shipData[] = json_decode($shipInfo, true);
        }
    }

    // Return as JSON
    header('Content-Type: application/json');
    echo json_encode($shipData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
}

// Call the function
getData($cacheService);
