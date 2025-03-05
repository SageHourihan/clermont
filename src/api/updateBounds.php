<?php
require_once __DIR__ . '/../../config/constants.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Services\CacheService;

$cacheService = new CacheService();

// Get new bounds from the request and cast to float to ensure numeric values
$south = isset($_POST['south']) ? (float)$_POST['south'] : null;
$west = isset($_POST['west']) ? (float)$_POST['west'] : null;
$north = isset($_POST['north']) ? (float)$_POST['north'] : null;
$east = isset($_POST['east']) ? (float)$_POST['east'] : null;

if ($south !== null && $west !== null && $north !== null && $east !== null) {
    $newBounds = [
        [$south, $west],
        [$north, $east]
    ];

    // Store the new bounds in cache
    $cacheService->store("map_bounds", json_encode($newBounds));

    echo "Bounds updated successfully.";
} else {
    http_response_code(400);
    echo "Invalid bounds data.";
}
?>
