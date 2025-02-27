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

$shipsData = $cacheService->getAllShipsData();

foreach ($shipsData as $ship => $message) {
    $metaData = json_decode($message)->MetaData ?? null;
    if ($metaData) {
        $mmsi = $metaData->MMSI;
        $lattitude = $metaData->Latitude;
        $longitude = $metaData->Longitude;
    }
}


