<?php
namespace Services;

use Memcached;

class CacheService
{
    private $memcache;

    public function __construct()
    {
        $this->memcache = new Memcached();
        $this->memcache->addServer('127.0.0.1', 11211);
    }

    // Store raw ship data
    public function storeShipData($mmsi, $data)
    {
        $this->memcache->set("ship:$mmsi", $data, 3600); // Cache for 1 hour
    }

    // Store active ships for plotting
    public function storeActiveShipsList($activeShips)
    {
        $this->memcache->set("ships:active", $activeShips, 600); // Cache for 10 minutes
    }

    // Get a list of the active ships
    public function getActiveShips()
    {
        return $this->memcache->get("ships:active") ?: [];
    }

    // Get stored raw ship data by MMSI
    public function getShipData($mmsi)
    {
        return $this->memcache->get("ship:$mmsi");
    }

    // Get all stored ship data
    public function getAllShipsData()
    {
        $activeShips = $this->getActiveShips();
        if (empty($activeShips)) {
            return [];
        }

        $shipKeys = array_map(fn($mmsi) => "ship:$mmsi", $activeShips);
        $shipsData = $this->memcache->getMulti($shipKeys);

        return $shipsData ?: [];
    }

    // store new data in memcached
    public function store($key, $value)
    {
        return $this->memcache->set($key, $value, 3600); // Cache for 1 hour
    }

    // fetch data from memcached by key
    public function fetch($key)
    {
        return $this->memcache->get($key);
    }
}
