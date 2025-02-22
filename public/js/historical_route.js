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
            } catch (error) {
                console.error("Processing Error:", error);
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX Request Failed:", status, error);
        }
    });
});
