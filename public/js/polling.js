function fetchAndPlotShips() {
    $.ajax({
        url: '../src/api/getData.php',  // Ensure correct path
        type: 'GET',
        dataType: 'json',  // Automatically parses JSON
        success: function(data) {
            try {
                console.log("Raw response:", data); // Debug response

                // Check if data is an array
                if (!Array.isArray(data)) {
                    console.error("Expected an array but got:", data);
                    return;
                }

                // Extract ship data
                let ships = data.map(item => {
                    let shipData = {};

                    console.log("Processing item:", item); // Debug each item

                    // Check for PositionReport and extract relevant data
                    if (item.Message?.PositionReport) {
                        shipData.name = item.MetaData?.ShipName || "Unknown Ship";
                        shipData.latitude = item.Message.PositionReport.Latitude;
                        shipData.longitude = item.Message.PositionReport.Longitude;
                    }

                    // If no PositionReport, check for ShipStaticData
                    if (!shipData.latitude || !shipData.longitude) {
                        if (item.Message?.ShipStaticData) {
                            shipData.name = item.MetaData?.ShipName || "Unknown Ship";
                            shipData.latitude = item.Message.ShipStaticData.latitude;
                            shipData.longitude = item.Message.ShipStaticData.longitude;
                        }
                    }

                    // Only include valid ships
                    return (shipData.latitude && shipData.longitude) ? shipData : null;
                }).filter(ship => ship !== null); // Filter out null values

                if (ships.length > 0) {
                    plotShipData(ships);
                } else {
                    console.log("No valid ships found.");
                }

            } catch (error) {
                console.error("Error processing data:", error);
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX error:", status, error);
        }
    });
}

// Run on page load
fetchAndPlotShips();

// Poll every 5 seconds
setInterval(fetchAndPlotShips, 5000);
