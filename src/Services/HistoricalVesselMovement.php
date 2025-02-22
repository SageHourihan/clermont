<?php

namespace Services;

require_once __DIR__ . '/../../config/db.php';
use Database;
use \PDO; // Add this to explicitly use the global PDO class

class HistoricalVesselMovement {
    private $pdo;

    public function __construct() {
        $database = new Database();
        $this->pdo = $database->getPdo();
    }

    public function getVesselMovement($mmsi) {
        $stmt = $this->pdo->prepare("SELECT * FROM historical_vessel_movement WHERE mmsi = :mmsi ORDER BY timestamp;");
        $stmt->execute(['mmsi' => $mmsi]);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC); // Note the backslash before PDO here
    }
}
