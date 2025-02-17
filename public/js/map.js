// Initialize the map
var map = L.map('map');

// Define the bounds of the bounding box using two corners (southwest and northeast).
var bounds = [
    [42.32707815, -83.2032273643204],  // Southwest corner
    [42.18912815, -83.0412166356796]   // Northeast corner
];

// Set the map to fit within these bounds.
map.fitBounds(bounds);

// Add the OpenStreetMap tile layer to the map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 12,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Function to fetch weather data from Open-Meteo API
function getWeatherData(lat, lng) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&windsor&hourly=temperature_2m,wind_speed_10m,wind_direction_10m`;

    $.getJSON(url, function(data) {
        const temp = data.current_weather.temperature.toFixed(1);  // Temperature in Fahrenheit
        const windSpeed = data.current_weather.windspeed.toFixed(1);  // Wind speed in mph
        const windDir = data.current_weather.winddirection;  // Wind direction in degrees

        // Update the weather overlay with the fetched data
        $('#weather-overlay').html(
            `Temperature: ${temp}°F | Wind Speed: ${windSpeed} mph | Wind Direction: ${windDir}°`
        );
    });
}

// Create a weather overlay div at the top of the map and center it
$('body').prepend('<div id="weather-overlay" style="position: fixed; top: 10px; left: 50%; transform: translateX(-50%); background: rgba(255, 255, 255, 0.7); padding: 10px; border-radius: 5px; z-index: 1000;"></div>');

// jQuery to update the coordinates on mouse move
$(document).ready(function() {
    // Listen for mousemove events on the map
    map.on('mousemove', function(event) {
        // Get the latitude and longitude from the event
        var lat = event.latlng.lat.toFixed(6);  // Get latitude and round to 6 decimal places
        var lng = event.latlng.lng.toFixed(6);  // Get longitude and round to 6 decimal places

        // Use jQuery to update the coordinates div
        $('#coordinates').text('Latitude: ' + lat + ' | Longitude: ' + lng);

        // Fetch the weather data for the center of the map
        getWeatherData(lat, lng);
    });

    // Also fetch the weather data for the initial map view (center of the bounds)
    var initialLat = (bounds[0][0] + bounds[1][0]) / 2;
    var initialLng = (bounds[0][1] + bounds[1][1]) / 2;
    getWeatherData(initialLat, initialLng);
});
