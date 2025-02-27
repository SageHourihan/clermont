// Initialize the map with a default center and zoom level
var map = L.map('map').setView([42.258103, -83.122222], 11); // Detroit River area

// Add the OpenStreetMap tile layer to the map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Store markers in an array to manage them
let markers = [];

// Function to get current map bounds
function getCurrentBounds() {
    var bounds = map.getBounds();
    return [
        [bounds.getSouth(), bounds.getWest()], // Southwest corner
        [bounds.getNorth(), bounds.getEast()]  // Northeast corner
    ];
}

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
$('body').prepend('<div id="weather-overlay"></div>');

// jQuery to update the coordinates on mouse move
$(document).ready(function() {
    // Listen for mousemove events on the map
    map.on('mousemove', function(event) {
        // Get the latitude and longitude from the event
        var lat = event.latlng.lat.toFixed(6);  // Get latitude and round to 6 decimal places
        var lng = event.latlng.lng.toFixed(6);  // Get longitude and round to 6 decimal places

        // Use jQuery to update the coordinates div
        $('#coordinates').text('Latitude: ' + lat + ' | Longitude: ' + lng);
    });

    // Get initial weather data for the center of the map
    var center = map.getCenter();
    getWeatherData(center.lat, center.lng);

    // Update bounds and weather data when map moves
    map.on('moveend', function() {
        var bounds = getCurrentBounds();

        // Optional: Display the current bounds (you can remove this in production)
        if ($('#bounds-display').length === 0) {
            $('body').append('<div id="bounds-display" style="position:fixed; bottom:10px; right:10px; z-index:1000; background:white; padding:5px; border-radius:5px;"></div>');
        }

        $('#bounds-display').html(
            `SW: [${bounds[0][0].toFixed(6)}, ${bounds[0][1].toFixed(6)}]<br>` +
            `NE: [${bounds[1][0].toFixed(6)}, ${bounds[1][1].toFixed(6)}]`
        );

        // Update weather for the new center
        var center = map.getCenter();
        getWeatherData(center.lat, center.lng);

        // You might want to reload ship data based on new bounds
        // loadShipDataForBounds(bounds);
    });
});

// Function to load ship data based on current bounds
// function loadShipDataForBounds(bounds) {
//     // Assuming you have an API endpoint that accepts bounds parameters
//     $.ajax({
//         url: '../src/api/getShipsInBounds.php',
//         type: 'GET',
//         data: {
//             south: bounds[0][0],
//             west: bounds[0][1],
//             north: bounds[1][0],
//             east: bounds[1][1]
//         },
//         success: function(response) {
//             try {
//                 const data = JSON.parse(response);
//                 plotShipData(data);
//             } catch (error) {
//                 console.log("Error processing data:", error);
//             }
//         },
//         error: function(xhr, status, error){
//             console.log("AJAX Error:", status, error);
//         }
//     });
// }

// Function to plot ships on the map
function plotShipData(shipData) {
    // Clear the existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = []; // Reset the markers array

    // Add new markers for each ship in the data
    shipData.forEach(function (ship) {
        const lat = ship.latitude;
        const lon = ship.longitude;

        // Define a custom icon
        var shipIcon = L.icon({
            iconUrl: '/clermont/assets/cargo-ship.png',  // Path to your custom icon image
            iconSize: [30, 30],  // Size of the icon
            iconAnchor: [16, 32],  // Point of the icon that will correspond to the marker's location
            popupAnchor: [0, -32]  // Offset for the popup (optional)
        });

        // Use this icon in your marker
        let marker = L.marker([lat, lon], { icon: shipIcon }).addTo(map);

        // Bind the popup content to the marker
        marker.bindPopup(`<b>${ship.name}</b><br>Lat: ${lat}, Lon: ${lon}`);

        // Show popup on mouseover and hide on mouseout
        marker.on('mouseover', function() {
            marker.openPopup();
        });

        marker.on('mouseout', function() {
            marker.closePopup();
        });

        // Store the marker to manage later
        markers.push(marker);

        marker.on('click', function() {
            getShipData(ship.mmsi);
        });
    });
}

function getShipData(mmsi) {
    $.ajax({
        url: '../src/api/getShipData.php',
        type: 'GET',
        data: {mmsi:mmsi},
        success: function(response) {
            try {
                const data = JSON.parse(response);
                displayShipDetails(data);
            } catch (error) {
                console.log("Error processing data:", error);
            }
        },
        error: function(xhr, status, error){
            console.log("AJAX Error:",  status, error);
        }
    });
}

function displayShipDetails(data) {
    const panel = $('#shipDetailPanel');
    panel.html(`
        <span class="close-btn" onclick="$('#shipDetailPanel').fadeOut();">&times;</span>
        <h2>${data.MetaData.ShipName.trim() || 'N/A'}</h2>
        <p><strong>MMSI:</strong> ${data.MetaData.MMSI}</p>
        <p><strong>Latitude:</strong> ${data.Message.PositionReport.Latitude.toFixed(6)}</p>
        <p><strong>Longitude:</strong> ${data.Message.PositionReport.Longitude.toFixed(6)}</p>
        <p><strong>SOG:</strong> ${data.Message.PositionReport.Sog} knots</p>
        <p><strong>Heading:</strong> ${data.Message.PositionReport.TrueHeading}&deg;</p>
        <p><strong>Navigation Status:</strong> ${getNavStatus(data.Message.PositionReport.NavigationalStatus)}</p>
        <p><strong>Last Update:</strong> ${data.MetaData.time_utc}</p>
        <button id='route_btn' data-mmsi=${data.MetaData.MMSI}>Get Route</button>
    `);
    panel.fadeIn(); // Show the panel with animation

    // Attach click event to the button (use event delegation to avoid issues)
    $('#route_btn').off('click').on('click', function() {
        let mmsi = $(this).data('mmsi');
        getHistoricalRoute(mmsi);
    });
}

// Close button functionality
$('#closePanelBtn').click(function() {
    $('#shipDetailPanel').fadeOut();
});

// Helper for navigational status
function getNavStatus(status) {
    const statusMap = {
        0: "Underway (Engine On)",
        1: "At Anchor",
        2: "Not Under Command",
        3: "Restricted Manoeuvrability",
        4: "Constrained by Draft",
        5: "Moored",
        6: "Aground",
        7: "Fishing",
        8: "Underway (Sailing)",
        15: "Unknown"
    };
    return statusMap[status] || "Unknown";
}

// get historical route data
function getHistoricalRoute(mmsi) {
    var base_url = $(location).prop("origin");
    window.location.href = base_url + "/clermont/public/historical_route.php?mmsi=" + mmsi;
}

// Expose the `plotShipData` function to the global scope for polling.js to call
window.plotShipData = plotShipData;
