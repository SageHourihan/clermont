-- Insert sample vessel movement records within the specified bounding box
INSERT INTO historical_vessel_movement (mmsi, latitude, longitude, timestamp)
VALUES
-- Start point
(123456789, 42.320000, -83.200000, '2024-02-21 08:00:00'),

-- Moving eastward
(123456789, 42.315000, -83.180000, '2024-02-21 08:10:00'),
(123456789, 42.310000, -83.160000, '2024-02-21 08:20:00'),

-- Turning southeast
(123456789, 42.300000, -83.140000, '2024-02-21 08:30:00'),
(123456789, 42.290000, -83.120000, '2024-02-21 08:40:00'),

-- Moving toward the southern boundary
(123456789, 42.270000, -83.100000, '2024-02-21 08:50:00'),
(123456789, 42.250000, -83.080000, '2024-02-21 09:00:00'),

-- Approaching eastern boundary
(123456789, 42.230000, -83.060000, '2024-02-21 09:10:00'),

-- Final point near southeast corner
(123456789, 42.200000, -83.045000, '2024-02-21 09:20:00');
