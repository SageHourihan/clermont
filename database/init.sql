-- Create database
CREATE DATABASE IF NOT EXISTS clermont_dev;
USE clermont_dev;

-- Create table for vessel movement
CREATE TABLE IF NOT EXISTS historical_vessel_movement (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mmsi BIGINT NOT NULL,
    latitude DECIMAL(10,6) NOT NULL,
    longitude DECIMAL(10,6) NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (mmsi, timestamp)
)
