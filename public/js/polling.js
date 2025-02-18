// Set the polling interval (e.g., every 5 seconds)
setInterval(function() {
    $.ajax({
        url: '../src/api/getData.php',  // Correct path to getData.php
        type: 'GET',
        dataType: 'json',  // Expecting a JSON response
        success: function(data) {
            try {
                // Parse each ship data string into an object
                let parsedData = data.map(item => JSON.parse(item));

                // Check if parsed data contains ships and plot them
                if (parsedData && parsedData.length > 0) {
                    // Extract ship data that contains latitude, longitude, and name
                    let ships = parsedData.map(item => {
                        let shipData = {};

                        console.log(item);
                        // Check for PositionReport and extract relevant data
                        if (item.Message.PositionReport) {
                            shipData.name = item.MetaData.ShipName || "Unknown Ship";
                            shipData.latitude = item.Message.PositionReport.Latitude;
                            shipData.longitude = item.Message.PositionReport.Longitude;
                        }

                        // If no PositionReport, check for ShipStaticData
                        if (!shipData.latitude || !shipData.longitude) {
                            if (item.Message.ShipStaticData) {
                                shipData.name = item.MetaData.ShipName || "Unknown Ship";
                                shipData.latitude = item.Message.ShipStaticData.latitude;
                                shipData.longitude = item.Message.ShipStaticData.longitude;
                            }
                        }

                        // Only include valid ships with latitude and longitude
                        if (shipData.latitude && shipData.longitude) {
                            return shipData;
                        } else {
                            return null;  // Exclude invalid ships
                        }
                    }).filter(ship => ship !== null); // Filter out null entries

                    // Call plotShipData to display the ships, if any ships are valid
                    if (ships.length > 0) {
                        plotShipData(ships);
                    } else {
                        console.log("No valid ships found or invalid data format");
                    }
                } else {
                    console.log("No ships found or invalid data format");
                }
            } catch (error) {
                console.error('Error parsing data:', error);
            }
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });
}, 5000); // Poll every 5000 milliseconds (5 seconds)
