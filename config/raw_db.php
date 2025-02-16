<?php

require 'vendor/autoload.php';  // Load Composer autoloader

use Dotenv\Dotenv;
use MongoDB\Client;
use MongoDB\Driver\ServerApi;

// Load environment variables from .env file
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Replace the placeholder with your Atlas connection string
$uri = $_ENV['MONGODB_URI'];
// Specify Stable API version 1
$apiVersion = new ServerApi(ServerApi::V1);
// Create a new client and connect to the server
$client = new MongoDB\Client($uri, [], ['serverApi' => $apiVersion]);
try {
    // Send a ping to confirm a successful connection
    $client->selectDatabase('admin')->command(['ping' => 1]);
    echo "Pinged your deployment. You successfully connected to MongoDB!\n";
} catch (Exception $e) {
    printf($e->getMessage());
}
