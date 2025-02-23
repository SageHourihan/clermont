$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mmsi = urlParams.get('mmsi');

    if (!mmsi) {
        console.warn("No MMSI provided in the URL.");
        return; // Stop execution if MMSI is missing
    }

    $.ajax({
        url: '../src/api/getVesselRoute.php',
        type: 'GET',
        data: { mmsi: mmsi },
        success: function(response) {
            try {
                console.log("AJAX Response:", response);
                plotRoute(response);
            } catch (error) {
                console.error("Processing Error:", error);
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX Request Failed:", status, error);
        }
    });
});

let routePolyline; // Store the polyline to manage it later

function plotRoute(historicalData) {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = []; // Reset the markers array

    // Clear existing polyline if it exists
    if (routePolyline) {
        map.removeLayer(routePolyline);
    }

    if (historicalData.length === 0) {
        console.warn("No historical data available to plot.");
        return;
    }

    // Collect coordinates for the polyline
    let coordinates = historicalData.map(point => [point.latitude, point.longitude]);

    // Add start and end circle markers
    const startPoint = historicalData[0];
    const endPoint = historicalData[historicalData.length - 1];

    // Start point marker (green)
    let startMarker = L.circleMarker([startPoint.latitude, startPoint.longitude], {
        color: 'green',
        radius: 8,
        weight: 3,
        fillOpacity: 0.8
    }).addTo(map).bindPopup("Start Point");
    markers.push(startMarker);

    // End point marker (red)
    let endMarker = L.circleMarker([endPoint.latitude, endPoint.longitude], {
        color: 'red',
        radius: 8,
        weight: 3,
        fillOpacity: 0.8
    }).addTo(map).bindPopup("End Point");
    markers.push(endMarker);

    // Plot markers for each point (optional, remove if cluttered)
    historicalData.forEach(function (point) {
        const lat = point.latitude;
        const lon = point.longitude;
        let marker = L.marker([lat, lon]);
        markers.push(marker);
    });

    // Create and add the polyline to connect the points
    routePolyline = L.polyline(coordinates, {
        color: 'blue', // Line color
        weight: 4,     // Line thickness
        opacity: 0.5,  // Transparency level
        dashArray: [20,10],
    }).addTo(map);

    // Fit the map view to the polyline bounds
    map.fitBounds(routePolyline.getBounds());
}
