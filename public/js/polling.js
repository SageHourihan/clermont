setInterval(function() {
    $.ajax({
        url: '../src/api/getData.php',  // Correct path to getData.php
        type: 'GET',
        dataType: 'json',  // Expecting a JSON response
        success: function(data) {
            try {
                // Log the full response to inspect its structure
                console.log('Full Response:', data);

                // Check if the response contains the necessary data
                if (data && data.Message) {
                    let shipData = {};

                    console.log('Processing message:', data.Message);

                    // Check if PositionReport exists
                    if (data.Message.PositionReport) {
                        shipData.name = data.MetaData.ShipName || "Unknown Ship";
                        shipData.latitude = data.Message.PositionReport.Latitude;
                        shipData.longitude = data.Message.PositionReport.Longitude;
                    }

                    // If no PositionReport, check for ShipStaticData
                    if ((!shipData.latitude || !shipData.longitude) && data.Message.ShipStaticData) {
                        shipData.name = data.MetaData.ShipName || "Unknown Ship";
                        shipData.latitude = data.Message.ShipStaticData.latitude;
                        shipData.longitude = data.Message.ShipStaticData.longitude;
                    }

                    // Check if the ship data is valid
                    if (shipData.latitude && shipData.longitude) {
                        // Call plotShipData to display the ship
                        plotShipData([shipData]);
                    } else {
                        console.log("No valid ship data found or invalid format");
                    }
                } else {
                    console.log("Invalid response format or missing 'Message' key");
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
