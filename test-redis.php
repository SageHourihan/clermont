<?php
require 'config/redis.php';

$cacheKey = 'test_connection';
$redis->set($cacheKey, 'Redis is working!');
echo $redis->get($cacheKey);
?>
