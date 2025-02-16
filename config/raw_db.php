<?php
require 'vendor/autoload.php'; // Load Composer autoloader

use Dotenv\Dotenv;
use MongoDB\Client;
use MongoDB\Driver\ServerApi;

function writeData(){


    // Load environment variables from .env file
    $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();

    $file = '/var/www/html/clermont/data/data.json';

    // mongodb connection URI
    $uri = $_ENV['MONGODB_URI'];

    // Specify Stable API version 1
    $apiVersion = new ServerApi(ServerApi::V1);

    // Create a new client and connect to the server
    $client = new MongoDB\Client($uri, [], ['serverApi' => $apiVersion]);
    $collection = $client->clermont->raw_data   ;

// try {
//     // Send a ping to confirm a successful connection
//     $client->selectDatabase('clermont')->command(['ping' => 1]);
//     echo "Pinged your deployment. You successfully connected to MongoDB!\n";
// } catch (Exception $e) {
//     printf($e->getMessage());
// }
    // Read the file line by line and decode each JSON object
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $jsonArray = array_map('json_decode', $lines);


    foreach ($jsonArray as $data) {
        $data = json_decode($data,true);

        // Access values
        $messageType = $data['MessageType'] ?? 'Unknown';
        $mmsi = $data['MetaData']['MMSI'] ?? 'Unknown';
        $shipName = trim($data['MetaData']['ShipName'] ?? 'Unknown');
        $latitude = $data['Message']['PositionReport']['Latitude'] ?? null;
        $longitude = $data['Message']['PositionReport']['Longitude'] ?? null;
        $sog = $data['Message']['PositionReport']['Sog'] ?? null;

        // Insert data into MongoDB
        $insertOneResult = $collection->insertOne([
            'messageType' => $messageType,
            'mmsi' => $mmsi,
            'shipName' => $shipName,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'sog' => $sog,
        ]);

        printf("Inserted %d document(s)\n", $insertOneResult->getInsertedCount());
        var_dump($insertOneResult->getInsertedId());

        // Output extracted values
        // echo "Message Type: $messageType\n";
        // echo "MMSI: $mmsi\n";
        // echo "Ship Name: $shipName\n";
        // echo "Latitude: $latitude\n";
        // echo "Longitude: $longitude\n";
        // echo "Speed Over Ground (SOG): $sog\n";
        // echo "---------------------------------\n";
    }
}


writeData();
