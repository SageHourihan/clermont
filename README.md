# Clermont

![Clermont Platform](assets/platform_pic.png)

Clermont is a sophisticated maritime vessel tracking platform. The system provides real-time monitoring and analytics for ships in the Port of Detroit and surrounding waters, offering crucial insights for maritime logistics and supply chain management.

## Table of Contents

1. [Current Status](#current-status)
2. [Features](#features)
3. [System Architecture](#system-architecture)
4. [Installation](#installation)
5. [Usage Guide](#usage-guide)
6. [Development Roadmap](#development-roadmap)
7. [License](#license)

## Current Status

Clermont is currently in active development, with core tracking functionality implemented for the Port of Detroit region. The platform successfully integrates real-time AIS data with weather information to provide a comprehensive maritime awareness solution.

### Current Coverage

- Port of Detroit
- Detroit River
- Surrounding Great Lakes waters

## Features

### Real-Time Tracking

- Live vessel position monitoring using AIS data
- Interactive map interface with custom ship markers
- Continuous data updates via WebSocket connection

### Weather Integration

- Real-time temperature readings
- Wind speed and direction data
- Dynamic weather updates based on map position

### Technical Implementation

- WebSocket integration for real-time data streaming
- MongoDB for efficient data storage
- Memcached for optimized performance
- Mobile-responsive design

## System Architecture

Clermont employs a modern LAMP stack architecture with additional technologies for real-time capabilities:

- Backend: PHP with MongoDB and MySQL
- Frontend: JavaScript with Leaflet.js
- Real-time: WebSocket connections
- Caching: Memcached
- APIs: AISStream, OpenWeather

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd clermont
    ```

2.  **Install Composer dependencies:**

    ```bash
    composer install
    ```

3.  **Set up the database:**

    -   Create a new MySQL database.
    -   Import the provided database schema (if available) or create the necessary tables.
    -   Create a `.env` file in the project root directory with your database credentials and other environment variables. Example:

        ```
        DB_HOST=your_database_host
        DB_NAME=your_database_name
        DB_USER=your_database_user
        DB_PASS=your_database_password
        ```

4.  **Configure constants:**

    -   Ensure the `config/constants.php` file correctly defines the `PROJECT_ROOT` constant.

5.  **Configure database connection:**

    -   The `config/db.php` file uses the `Dotenv` library to load environment variables from the `.env` file. Make sure your database credentials are correctly set in the `.env` file.

6.  **Set up web server:**

    -   Configure your web server (e.g., Apache, Nginx) to point the document root to the `public` directory.
    -   Ensure that the web server has write permissions to the necessary directories (e.g., for logs or uploaded files, if any).

7.  **Access the application:**

    -   Open your web browser and navigate to the project's URL.

## Usage Guide

-   **Real-time tracking:** The `index.php` page displays the real-time location of active ships on a map.
-   **Historical route:** The `historical_route.php` page displays the historical route of a selected vessel. You can access this page by clicking on a vessel on the map and then clicking the "Get Route" button.
-   **About:** The `about.php` page provides information about the Clermont Tracker project.
-   **Contact:** The contact form is located at the contact button in the nav bar.

### Weather Information

- Weather data updates as you move your mouse across the map
- Temperature displayed in Fahrenheit
- Wind speed shown in miles per hour
- Wind direction indicated in degrees

## Development Roadmap

Clermont is following a structured development plan to expand its capabilities. View our detailed [Development Roadmap](roadmap.md) for information about upcoming features and enhancements.

Key upcoming developments include:

- Enhanced vessel information display
- Advanced analytics dashboard
- Custom alert system
- Expanded geographic coverage
- Supply chain integration

## License

MIT License

Copyright © 2025 Sage Hourihan.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

*Clermont is an open-source project maintained by Sage Hourihan. Contributions are welcome!*
