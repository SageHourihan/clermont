var map = L.map('map');

// Define the bounds of the bounding box using two corners (southwest and northeast).
var bounds = [
    [42.32707815, -83.2032273643204],  // Southwest corner
    [42.18912815, -83.0412166356796]   // Northeast corner
];

// Set the map to fit within these bounds.
map.fitBounds(bounds);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

