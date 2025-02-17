<?php

function getData() {
    $file = '/var/www/html/clermont/data/data.json';

    // Read the file line by line and decode each JSON object
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $jsonArray = array_map('json_decode', $lines);
    
    // Return as a JSON array
    header('Content-Type: application/json');
    echo json_encode($jsonArray); // Changed from return to echo
}

// Call the function so the script actually outputs data
getData();
