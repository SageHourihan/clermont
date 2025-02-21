<?php

namespace Services;

use Database;
require_once __DIR__ . '/../../config/db.php';

class HistoricalVesselMovement {

    private $pdo;

    public function __construct(){
        $database = new Database();
        $this->pdo = $database->getPdo();
    }

    public function getVesselMovement($mmsi){
        $stmt = $this->pdo->prepare("SELECT * FROM historical_vessel_movement WHERE mmsi = :mmsi ORDER BY timestamp;");
        $stmt->execute(['mmsi' => $mmsi]);
        return $stmt;
    }

}
