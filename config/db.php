<?php
// Load .env file and its variables
require_once '../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . "/..");
$dotenv->load();

// Accessing the environment variables
$host = $_ENV['DB_HOST'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];

//Create a PD instance
try{
	$conn = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
	//set the PDO error mode to exception
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}catch(PDOException $e){
	//if connection fails, display error message
	die("Connection failed: " . $e->getMessage());
}