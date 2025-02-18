<?php
require '/var/www/html/clermont/config/redis.php'; // Load Redis connection

// Function to get data for all ships from Redis
function getData() {
    global $redis;

    // Initialize an empty array for ship data
    $shipDataArray = [];

    // Retrieve all active ships from the Redis set
    $activeShips = $redis->smembers("ships:active");

    // Loop through each active ship and get its data from Redis
    foreach ($activeShips as $mmsi) {
        $shipData = $redis->get("ship:$mmsi");

        if ($shipData) {
            // Decode the data from JSON format
            $decodedData = json_decode($shipData, true);
            $shipDataArray[] = $decodedData; // Add to the result array
        }
    }

    // If no ships data found, return empty array
    if (empty($shipDataArray)) {
        echo "Error: No ships data available.";
    } else {
        // Return the ship data as JSON
        echo json_encode($shipDataArray);
    }
}

// Call the function to get data
getData();
