<?php
require 'vendor/autoload.php'; // Load Composer autoloader
require '/var/www/html/clermont/config/db.php'; // Assuming this file creates the PDO instance

use Dotenv\Dotenv;
use MongoDB\Client;
use MongoDB\Driver\ServerApi;
use MongoDB\BSON\UTCDateTime;

function formatData() {
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
        $dateString = $data['time_utc'];
        // Remove microseconds and timezone (+0000 UTC)
        $dateString = preg_replace('/\.\d+/', '', $dateString);  // Remove microseconds
        $dateString = preg_replace('/\s\+\d{4} UTC$/', '', $dateString); // Remove timezone info

        // Create DateTime object
        $date = DateTime::createFromFormat('Y-m-d H:i:s', $dateString);

        // Check if DateTime creation was successful
        if ($date === false) {
            echo "Failed to parse date.";
        } else {
            // Format the date in MySQL's DATETIME format
            $timestamp = $date->format('Y-m-d H:i:s');
        }

        // Prepare data for insertion
        $mmsi = $data['MMSI'];
        $ship_name = $data['ShipName'];
        $latitude = $data['Latitude'];
        $longitude = $data['Longitude'];
        $cog = $data['Cog'];
        $sog = $data['Sog'];
        $true_heading = $data['TrueHeading'];
        $rate_of_turn = $data['RateOfTurn'];
        $valid = $data['Valid'];
        $position_accuracy = !empty($data['PositionAccuracy']) ? $data['PositionAccuracy'] : NULL;
        $navigational_status = $data['NavigationalStatus'];
        $communication_state = $data['CommunicationState'];
        $raim = $data['Raim'];
        $spare = $data['Spare'];
        $special_manoeuvre_indicator = $data['SpecialManoeuvreIndicator'];

        // Insert into ships table (use ON DUPLICATE KEY UPDATE to prevent duplicates)
        $sql = "INSERT INTO ships (mmsi, ship_name, latitude, longitude)
                VALUES (:mmsi, :ship_name, :latitude, :longitude)
                ON DUPLICATE KEY UPDATE ship_name = VALUES(ship_name), latitude = VALUES(latitude), longitude = VALUES(longitude)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':mmsi', $mmsi);
        $stmt->bindParam(':ship_name', $ship_name);
        $stmt->bindParam(':latitude', $latitude);
        $stmt->bindParam(':longitude', $longitude);
        $stmt->execute();

        // Insert into position_reports table
        $sqlPosition = "INSERT INTO position_reports (mmsi, timestamp, cog, sog, true_heading, rate_of_turn, valid, position_accuracy, navigational_status)
                        VALUES (:mmsi, :timestamp, :cog, :sog, :true_heading, :rate_of_turn, :valid, :position_accuracy, :navigational_status)";
        $stmtPosition = $pdo->prepare($sqlPosition);
        $stmtPosition->bindParam(':mmsi', $mmsi);
        $stmtPosition->bindParam(':timestamp', $timestamp);
        $stmtPosition->bindParam(':cog', $cog);
        $stmtPosition->bindParam(':sog', $sog);
        $stmtPosition->bindParam(':true_heading', $true_heading);
        $stmtPosition->bindParam(':rate_of_turn', $rate_of_turn);
        $stmtPosition->bindParam(':valid', $valid);
        $stmtPosition->bindParam(':position_accuracy', $position_accuracy);
        $stmtPosition->bindParam(':navigational_status', $navigational_status);
        $stmtPosition->execute();

        // Insert into metadata table
        $sqlMetadata = "INSERT INTO metadata (mmsi, timestamp, communication_state, raim, spare, special_manoeuvre_indicator)
                        VALUES (:mmsi, :timestamp, :communication_state, :raim, :spare, :special_manoeuvre_indicator)";
        $stmtMetadata = $pdo->prepare($sqlMetadata);
        $stmtMetadata->bindParam(':mmsi', $mmsi);
        $stmtMetadata->bindParam(':timestamp', $timestamp);
        $stmtMetadata->bindParam(':communication_state', $communication_state);
        $stmtMetadata->bindParam(':raim', $raim);
        $stmtMetadata->bindParam(':spare', $spare);
        $stmtMetadata->bindParam(':special_manoeuvre_indicator', $special_manoeuvre_indicator);
        $stmtMetadata->execute();

        echo "Inserted ". $stmtPosition->rowCount(). " position report row(s), and ". $stmtMetadata->rowCount(). " metadata row(s).\n";
    }

    unset($pdo); // Close the PDO connection
}

formatData();
