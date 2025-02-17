// Set the polling interval (e.g., every 5 seconds)
setInterval(function() {
    $.ajax({
        url: '..//src/api/getData.php',  // Correct path to getData.php
        type: 'GET',
        dataType: 'json',  // Expecting a JSON response
        success: function(data) {
            // Update the UI with the latest data
            console.log(data); // You can replace this with code to update your HTML
            $('#response').append(data);
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });
}, 5000); // Poll every 5000 milliseconds (5 seconds)
