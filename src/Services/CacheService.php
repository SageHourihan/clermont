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

    // store raw ship data
    public function storeShipData($mmsi, $data)
    {
        $this->memcache->set("ship:$mmsi", $data, 3600);// Cache for 1 hour
    }

    // store active ships for plotting
    public function storeActiveShipsList($activeShips)
    {
        $this->memcache->set("ships:active", $activeShips, 600); // Cache for 10 minutes
    }

    // get a list of the active ships
    public function getActiveShips()
    {
        return $this->memcache->get("ships:active");
    }

    // get stored raw ship data by mmsi
    public function getShipData($mmsi){
        return $this->memcache->get("ship:$mmsi");
    }

    //TODO: create get all ships
}
