<?php

function getData() {
    // Absolute path to data.json from the root of the project
    return file_get_contents('/var/www/html/clermont/data/data.json');
}
