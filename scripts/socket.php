<?php
require 'vendor/autoload.php';  // Load Composer autoloader

use Dotenv\Dotenv;
use WebSocket\Client;

// Load environment variables from .env file
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Retrieve the API key from the environment
$apiKey = $_ENV['AISSTREAM_API_KEY'];

// Connect to the WebSocket server
$client = new Client("wss://stream.aisstream.io/v0/stream");

// Connect to Memcached
$memcache = new Memcached();
$memcache->addServer('127.0.0.1', 11211);

// Prepare the message
$message = json_encode([
   "APIKey" => $apiKey,  // API Key from environment
    "BoundingBoxes" => [
        [[42.32707815, -83.2032273643204], [42.18912815, -83.0412166356796]]
    ]
]);

// Send the message
$client->send($message);

// Listen for messages from the server
while (true) {
    try {
        // Receive a message from the WebSocket server
        $incomingMessage = $client->receive();
        // echo "Received message: $incomingMessage\n";

        // Unescape the JSON string (convert escaped quotes to normal quotes)
        $unescapedMessage = stripslashes($incomingMessage);
        // Decode the unescaped JSON string into an associative array
        $data = json_decode($unescapedMessage, true);

        if(isset($data['MetaData']['MMSI'])){
            $mmsi = $data['MetaData']['MMSI'];

            $memcache->set("ship:$mmsi", $incomingMessage, 3600);
            echo 'stored data in memcache';
        }else{
            echo 'no mmsi in messag';
        }

        // file_put_contents('/var/www/html/clermont/data/data.json', json_encode($incomingMessage) . "\n", FILE_APPEND);
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
