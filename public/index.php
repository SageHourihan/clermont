<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clermont Tracker</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap" rel="stylesheet">
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

    <div id="shipDetailPanel">
        <h2>Ship Details</h2>
        <p><strong>Name:</strong> <span id="shipName"></span></p>
        <p><strong>MMSI:</strong> <span id="mmsi"></span></p>
        <p><strong>Latitude:</strong> <span id="latitude"></span></p>
        <p><strong>Longitude:</strong> <span id="longitude"></span></p>
        <p><strong>Speed (SOG):</strong> <span id="sog"></span> knots</p>
        <p><strong>Heading:</strong> <span id="heading"></span>°</p>
        <p><strong>Navigational Status:</strong> <span id="navStatus"></span></p>
        <p><strong>Last Update:</strong> <span id="lastUpdate"></span></p>
        <button id="closePanelBtn">Close</button>
    </div>


    <div id="map"></div>
    <div id="coordinates"></div>

    <!-- <div id="response"></div> -->
    <script src="js/map.js"></script>
    <script src="js/polling.js"></script>
</body>
</html>
