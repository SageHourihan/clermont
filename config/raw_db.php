<?php
require 'vendor/autoload.php'; // Load Composer autoloader

use Dotenv\Dotenv;
use MongoDB\Client;
use MongoDB\Driver\ServerApi;

function writeData(){
    $error = null;

    // Load environment variables from .env file
    $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();

    $file = '/var/www/html/clermont/data/data.json';

    // MongoDB connection URI
    $uri = $_ENV['MONGODB_URI'];

    // Specify Stable API version 1
    $apiVersion = new ServerApi(ServerApi::V1);

    // Create a new client and connect to the server
    $client = new MongoDB\Client($uri, [], ['serverApi' => $apiVersion]);
    $collection = $client->clermont->raw_data;

    // Read the file line by line and decode each JSON object
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $jsonArray = array_map('json_decode', $lines);

    foreach ($jsonArray as $data) {
        $data = json_decode($data, true);

        if (!is_array($data)) {
            continue; // Skip invalid JSON
        }

        // Flatten the structure and store all key-value pairs dynamically
        $document = [];

        // Recursively process the JSON object to flatten it into a single-level associative array
        array_walk_recursive($data, function($value, $key) use (&$document) {
            $document[$key] = $value;
        });

        try {
            // Insert dynamically structured data into MongoDB
            $insertOneResult = $collection->insertOne($document);
        } catch (Exception $e) {
            $error = $e->getMessage();
        }

        if (!$error) {
            echo sprintf("Inserted %d document(s)\n", $insertOneResult->getInsertedCount());
        } else {
            echo json_encode($error);
        }
    }
}

writeData();
