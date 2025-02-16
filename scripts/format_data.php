<?php
require 'vendor/autoload.php'; // Load Composer autoloader
require '/var/www/html/clermont/config/db.php'; // Assuming this file creates the PDO instance

use Dotenv\Dotenv;
use MongoDB\Client;
use MongoDB\Driver\ServerApi;
use MongoDB\BSON\UTCDateTime;

function formatData(){
    global $pdo; // Use the existing PDO connection from db.php
    $error = null;

    // Load environment variables from .env file (if not already loaded in db.php)
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
            'sort' => ['time_utc' => -1], // Sort by time_utc in descending order
            'limit' => 10, // Limit to the most recent 10 entries
        ]
    );

    // Convert the cursor to an array
    $dataArray = iterator_to_array($cursor);

    // Iterate over the data and insert into MySQL
    foreach ($dataArray as $data) {
        $sql = "INSERT INTO ships (mmsi, ship_name, latitude, longitude) VALUES (:mmsi, :ship_name, :latitude, :longitude)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':mmsi', $data['MMSI']);
        $stmt->bindParam(':ship_name', $data['ShipName']);
        $stmt->bindParam(':latitude', $data['Latitude']);
        $stmt->bindParam(':longitude', $data['Longitude']);

        try {
            $stmt->execute();
        } catch (Exception $e) {
            $error = $e->getMessage();
        }

        if(!$error){
            echo "Inserted ". $stmt->rowCount(). " row(s).\n";
        }else{
            echo json_encode($error);
        }
    }

    unset($pdo);
}

formatData();
