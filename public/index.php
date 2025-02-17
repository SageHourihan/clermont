<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clermont Tracker</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
</head>
<body>
    
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
    <!-- <h1>Live Ship Tracking</h1> -->
    <!-- <pre id="dataDisplay">Waiting for data...</pre> -->

    <div id="map"></div>
    <div id="coordinates"></div>

    <!-- <div id="response"></div> -->
    <script src="js/map.js"></script>
    <!-- <script src="js/polling.js"></script> -->
</body>
</html>
