<?php

require '/var/www/html/clermont/config/redis.php'; // Load Redis connection

function getData() {
    global $redis; // Use the Redis instance

    $cacheKey = 'ais_live_data';
    $data = $redis->get($cacheKey);

    // Return empty array if no data is found
    $jsonArray = $data ? json_decode($data, true) : [];

    // Output JSON response
    echo json_encode($jsonArray);
}

// Execute function
getData();
