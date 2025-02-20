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

    public function storeShipData($mmsi, $data)
    {
        $this->memcache->set("ship:$mmsi", $data, 3600);
    }

    public function storeActiveShipsList($activeShips)
    {
        $this->memcache->set("ships:active", $activeShips, 600); // Cache for 10 minutes
    }

    public function getActiveShips()
    {
        return $this->memcache->get("ships:active");
    }
    public function getShipData($mmsi){
        return $this->memcache->get("ship:$mmsi");
    }
}
