
# Clermont

**Clermont** is a live ship tracking tool designed to monitor vessels using real-time data. At its current stage, the tracker focuses on ships within the Port of Detroit and the surrounding waters, providing detailed location and weather information for maritime traffic in this specific area.
## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Usage](#usage)
4. [Contributing](#contributing)
4. [License](#license)

## Overview

Clermont utilizes the AISStream API to pull live ship data and display it on an interactive map. Currently, it is limited to tracking ships in and around the Port of Detroit, providing users with real-time vessel locations and weather data relevant to this specific region. The interactive map, allows users to track vessels' movements and view weather conditions in the immediate area.

While the tool currently focuses on the Port of Detroit, there are plans to expand its geographic coverage to include other ports and maritime routes in the future.

## Features

- **Real-Time Ship Tracking**: Monitor ships in the Port of Detroit and surrounding waters on an interactive map.
- **Weather Data Integration**: Get real-time weather information for the tracked area, including temperature, wind speed, and wind direction.
- **Responsive Design**: Mobile-friendly interface for easy access on any device.
- **Live Updates**: Uses AJAX polling for continuous real-time data updates without the need for a page reload.
- **Intuitive User Interface**: Easy-to-use map display and clear navigation for efficient ship tracking.

## Usage

### Start Polling

Clermont uses AJAX polling to fetch and display ship data in real-time. To start tracking ships:

1. Open the application in your browser.
2. The map will load, and the application will automatically start fetching live data from the backend.
3. You will see markers representing ship locations on the map within the Port of Detroit and surrounding waters.
4. Real-time weather data will be updated based on the coordinates of the map's center.

### Weather Overlay

The weather overlay provides current weather conditions at your mouses location on the map. The weather data includes:
- Temperature (in Fahrenheit)
- Wind speed (in miles per hour)
- Wind direction (in degrees)

## Contributing

Since this is a closed-source project, contributions are currently not accepted. However, if you have suggestions or feature requests, please reach out to the project maintainers.

## License

This project is **closed-source**. © 2025 Black Sun Technologies. All rights reserved.
