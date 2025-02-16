// Set the polling interval (e.g., every 5 seconds)
setInterval(function() {
    fetch('/path/to/get-latest-data.php')
        .then(response => response.json())
        .then(data => {
            // Update the UI with the latest data
            console.log(data); // You can replace this with code to update your HTML
        })
        .catch(error => console.error('Error fetching data:', error));
}, 5000); // Poll every 5000 milliseconds (5 seconds)

