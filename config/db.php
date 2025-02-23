<?php
require __DIR__ . '/../vendor/autoload.php'; // Load Composer autoloader

use Dotenv\Dotenv;

class Database {
    private $host;
    private $db;
    private $user;
    private $password;
    private $charset;
    private $pdo;

    public function __construct() {
        // Load environment variables from .env file
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
        $dotenv->load();

        // Set up database connection details from .env variables
        $this->host = $_ENV['DB_HOST'];
        $this->db = $_ENV['DB_NAME'];
        $this->user = $_ENV['DB_USER'];
        $this->password = $_ENV['DB_PASS'];
        $this->charset = 'utf8mb4';

        // Set up the PDO connection
        $this->pdo = $this->connect();
    }

    // Method to establish and return a PDO connection
    private function connect() {
        $dsn = "mysql:host={$this->host};dbname={$this->db};charset={$this->charset}";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            // Create the PDO instance and return it
            return new PDO($dsn, $this->user, $this->password, $options);
        } catch (\PDOException $e) {
            // If there's an error, throw an exception
            throw new \PDOException($e->getMessage(), (int)$e->getCode());
        }
    }

    // Method to get the PDO instance (useful for queries)
    public function getPdo() {
        return $this->pdo;
    }
}

// Create a new instance of Database
$db = new Database();
$pdo = $db->getPdo(); // Use this variable to interact with the MySQL database
