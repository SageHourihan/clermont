<?php
require_once __DIR__ . '/../../vendor/autoload.php';

use Services\HistoricalVesselMovement;

header('Content-Type: application/json');

try {
    $mmsi = $_GET['mmsi'];
    $vesselHistoryService = new HistoricalVesselMovement();
    $vesselHistory = $vesselHistoryService->getVesselMovement($mmsi);

    echo json_encode($vesselHistory);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
