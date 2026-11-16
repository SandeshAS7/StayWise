-- Database initialization script for StayWise MySQL Container
CREATE DATABASE IF NOT EXISTS staywise CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'staywise_app'@'%' IDENTIFIED BY 'staywise_password';
GRANT ALL PRIVILEGES ON staywise.* TO 'staywise_app'@'%';
FLUSH PRIVILEGES;
