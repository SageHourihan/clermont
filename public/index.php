<?php

require_once __DIR__ . '/../src/api/getData.php';

$data = getData();

echo json_encode($data);

