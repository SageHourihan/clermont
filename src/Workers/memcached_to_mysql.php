<?php

// Include autoload and required config files
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../config/constants.php';
require_once __DIR__ . '/../../config/db.php'; // Ensure this file contains the Database class

use Services\CacheService;

// Initialize database connection
$database = new Database(); // Make sure db.php defines this class
$pdo = $database->getPdo(); // Assign the PDO instance to a local variable

// Load environment variables from .env file
$dotenv = Dotenv\Dotenv::createImmutable(PROJECT_ROOT);
$dotenv->load();

// Create an instance of CacheService
$cacheService = new CacheService();
$shipsData = $cacheService->getAllShipsData();
$error = null;

foreach ($shipsData as $ship => $message) {
    $data = json_decode($message, true); // Decode JSON as associative array
    $metaData = $data['MetaData'] ?? null;

    if ($metaData) {
        // echo json_encode($metaData['MMSI']);
        $mmsi = $metaData['MMSI'];
        $latitude = $metaData['latitude'];
        $longitude = $metaData['longitude'];

        try {
            // Prepare and execute the SQL statement
            $stmt = $pdo->prepare("INSERT INTO historical_vessel_movement (mmsi, latitude, longitude) VALUES (:mmsi, :latitude, :longitude)");
            $stmt->execute([
                ':mmsi' => $mmsi,
                ':latitude' => $latitude,
                ':longitude' => $longitude
            ]);
            echo "Inserted ship data for MMSI: {$mmsi}\n";
        } catch (Exception $e) {
            $error = $e->getMessage();
        }

        if($error)
            error_log(json_encode($error, JSON_PRETTY_PRINT));

    }
}
