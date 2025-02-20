# Clermont

![Clermont Platform](assets/platform_pic.png)

Clermont is a sophisticated maritime vessel tracking platform developed by Black Sun Technologies. The system provides real-time monitoring and analytics for ships in the Port of Detroit and surrounding waters, offering crucial insights for maritime logistics and supply chain management.

## Table of Contents
1. [Current Status](#current-status)
2. [Features](#features)
3. [System Architecture](#system-architecture)
4. [Usage Guide](#usage-guide)
5. [Development Roadmap](#development-roadmap)
6. [License](#license)

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

## Usage Guide

### Tracking Interface
1. Access the platform through your web browser
2. The map automatically centers on the Port of Detroit
3. Ship markers appear in real-time as vessels are detected
4. Hover over markers for basic vessel information
5. Click markers for detailed ship data

### Weather Information
- Weather data updates as you move your mouse across the map
- Temperature displayed in Fahrenheit
- Wind speed shown in miles per hour
- Wind direction indicated in degrees

## Development Roadmap

Clermont is following a structured development plan to expand its capabilities. View our detailed [Development Roadmap](ROADMAP.md) for information about upcoming features and enhancements.

Key upcoming developments include:
- Enhanced vessel information display
- Advanced analytics dashboard
- Custom alert system
- Expanded geographic coverage
- Supply chain integration

## License

© 2025 Black Sun Technologies. All rights reserved.

---

*Clermont is a closed-source project maintained by Black Sun Technologies. For inquiries about commercial usage or partnership opportunities, please contact our business development team.*
