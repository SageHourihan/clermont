<?php
// Connect to Memcached
$memcache = new Memcached();
$memcache->addServer('127.0.0.1', 11211);

// Store data in cache
$memcache->set("username", "Sage", 3600); // Cache for 1 hour

// Retrieve data from cache
echo "Cached Value: " . $memcache->get("username");
?>
