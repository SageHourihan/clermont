<?php

$memcache = new Memcached();
$memcache->addServer('127.0.0.1', 11211);

function getData($memcache) {
    // Get the list of active ships (an array of MMSIs)
    $activeShips = $memcache->get("ships:active");

    // If there are no active ships, return an empty array
    if ($activeShips === false || !is_array($activeShips)) {
        $activeShips = [];
    }

    $shipData = [];

    // Retrieve each ship's data from Memcached
    foreach ($activeShips as $mmsi) {
        $shipInfo = $memcache->get("ship:$mmsi");

        if ($shipInfo !== false) {
            $shipData[] = json_decode($shipInfo, true);
        }
    }

    // Return as JSON
    header('Content-Type: application/json');
    // echo json_encode($shipData);
    echo json_encode($shipData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
}

// Call the function
getData($memcache);
