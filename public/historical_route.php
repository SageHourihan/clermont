<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historical Route</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
</head>
<body>

    <?php
        $mmsi = $_GET['mmsi'];
    ?>

    <div id="navbar">
        <div class="brand">Clermont</div>
        <div class="nav-items">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <input type="text" placeholder="Search...">
            <div class="profile"></div>
        </div>
    </div>


    <div id="map"></div>
    <div id="coordinates"></div>

    <script src="js/historical_route.js"></script>
    <script src="js/map.js"></script>
</body>
</html>
