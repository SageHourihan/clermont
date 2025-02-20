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

if (isset($_GET['mmsi']) && !empty($_GET['mmsi'])) {
    $mmsi = $_GET['mmsi'];  // Get the MMSI value

    $cacheService = new CacheService();
    $shipData = $cacheService->getShipData($mmsi);

    echo json_encode($shipData);


} else {
    echo "Error: No valid MMSI provided.";
}

