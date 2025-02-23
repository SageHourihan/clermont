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

    // Collect coordinates for the polyline
    let coordinates = historicalData.map(point => [point.latitude, point.longitude]);

    // Plot markers and build coordinates array
    historicalData.forEach(function (point) {
        const lat = point.latitude;
        const lon = point.longitude;

        // Add marker for each point
        let marker = L.marker([lat, lon]).addTo(map);
        markers.push(marker);
    });

    // Create and add the polyline to connect the points
    routePolyline = L.polyline(coordinates, {
        color: 'blue', // Line color
        weight: 4,     // Line thickness
        opacity: 0.5,  // Transparency level
        dashArray: [20,10],
    }).addTo(map);

    // Optionally fit the map view to the polyline bounds
    map.fitBounds(routePolyline.getBounds());
}
