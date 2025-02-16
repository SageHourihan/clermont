<?php
require 'vendor/autoload.php'; // Load Composer autoloader

use Dotenv\Dotenv;
use MongoDB\Client;
use MongoDB\Driver\ServerApi;
use MongoDB\BSON\UTCDateTime;

function formatData(){

    // Load environment variables from .env file
    $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();

    // MongoDB connection URI
    $uri = $_ENV['MONGODB_URI'];

    // Specify Stable API version 1
    $apiVersion = new ServerApi(ServerApi::V1);

    // Create a new client and connect to the server
    $client = new MongoDB\Client($uri, [], ['serverApi' => $apiVersion]);
    $collection = $client->clermont->raw_data;

    // Get the current time and 24 hours ago
    $currentTime = new UTCDateTime();
    $startTime = new UTCDateTime(strtotime("-24 hours") * 1000); // 24 hours ago

    // Find the most recent entries within the last 24 hours
    $cursor = $collection->find(
        [
            'created_at' => [
                '$gte' => $startTime, // Greater than or equal to 24 hours ago
                '$lte' => $currentTime, // Less than or equal to the current time
            ],
        ],
        [
            'projection' => [
                'MMSI' => 1,
                'Longitude' => 1,
                'Latitude' => 1,
                'time_utc' => 1, // Include time_utc in the projection to verify the data
            ],
            'sort' => ['time_utc' => -1], // Sort by time_utc in descending order
            'limit' => 10, // Limit to the most recent 10 entries
        ]
    );

    // Convert the cursor to an array
    $dataArray = iterator_to_array($cursor);

    // Print the data if it exists
    if (count($dataArray) > 0) {
        echo "\nData found: ";
        echo json_encode($dataArray); // Will print the array in JSON format
    } else {
        echo "\nNo data found in the specified time frame.";
    }

    // Iterate over the data and print it
    foreach ($dataArray as $data) {
        print_r($data);
    }
}

formatData();
