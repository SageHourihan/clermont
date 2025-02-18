<?php
require 'vendor/autoload.php'; // Load Composer autoloader

use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Load environment variables
$redisHost = $_ENV['REDIS_HOST'];
$redisPort = $_ENV['REDIS_PORT'];
$redisPassword = $_ENV['REDIS_PASSWORD'];

$redis = new Redis();
$redis->connect($redisHost, $redisPort);
$redis->auth($redisPassword);

// Test connection
if ($redis->ping()) {
    echo "Connected to Redis!\n";
} else {
    echo "Failed to connect.";
}
