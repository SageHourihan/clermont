<?php
require_once __DIR__ . '/../../vendor/autoload.php'; // Ensure the autoloader is included
use Services\HistoricalVesselMovement;

$vesselHistoryService = new HistoricalVesselMovement();

// Get vessel movement data (make sure getVesselMovement returns an array)
$vesselHistory = $vesselHistoryService->getVesselMovement('123456789');

// Prepare all the records as an array (assuming getVesselMovement returns an array)
$response = [];

foreach ($vesselHistory as $rec) {
    $response[] = $rec; // Collect each record into an array
}

// Output the result as a JSON array
echo json_encode($response, JSON_PRETTY_PRINT);
