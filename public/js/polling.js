setInterval(function() {
    $.ajax({
        url: '../src/api/getData.php',  // Correct path to getData.php
        type: 'GET',
        dataType: 'json',  // Expecting a JSON response
        success: function(data) {
            console.log('Full Response:', data);

            try {
                // Ensure that data is an array
                if (Array.isArray(data) && data.length > 0) {
                    let allShipData = [];

                    data.forEach(ship => {
                        let shipData = {};

                        console.log('Processing message:', ship.Message);
                        if(ship.Message.AidsToNavigationReport || ship.Message.BaseStationReport){
                            return;
                        }

                        // Extract ship information from PositionReport if available
                        if (ship.Message.PositionReport) {
                            shipData.name = ship.MetaData.ShipName || "Unknown Ship";
                            shipData.latitude = ship.Message.PositionReport.Latitude;
                            shipData.longitude = ship.Message.PositionReport.Longitude;
                            shipData.timestamp = ship.MetaData.time_utc;
                            shipData.cog = ship.Message.PositionReport.Cog;
                            shipData.sog = ship.Message.PositionReport.Sog;

                            console.log(`PositionReport data for ${shipData.name}:`, shipData);
                        }

                        // If no PositionReport, check for ShipStaticData
                        if ((!shipData.latitude || !shipData.longitude) && ship.Message.ShipStaticData) {
                            shipData.name = ship.MetaData.ShipName || "Unknown Ship";
                            shipData.latitude = ship.Message.ShipStaticData.latitude;
                            shipData.longitude = ship.Message.ShipStaticData.longitude;
                            shipData.timestamp = ship.MetaData.time_utc;

                            console.log(`ShipStaticData for ${shipData.name}:`, shipData);
                        }

                        // Check if the ship data is valid
                        if (shipData.latitude && shipData.longitude) {
                            allShipData.push(shipData);  // Collect all valid ships
                        } else {
                            console.log(`No valid ship data found or invalid format for ${ship.MetaData.ShipName}`);
                        }
                    });

                    // Log all the ship data that will be plotted
                    console.log('All valid ship data:', allShipData);

                    // If any valid ship data exists, plot it
                    if (allShipData.length > 0) {
                        plotShipData(allShipData);  // Assuming plotShipData accepts an array of ships
                    } else {
                        console.log("No valid ship data to plot.");
                    }
                } else {
                    console.log("Invalid response format or no data available.");
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
