-- XLIME GEAR local MySQL setup
-- Run while connected as MySQL root.
CREATE DATABASE IF NOT EXISTS xlime_gear CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'xlime_app'@'localhost' IDENTIFIED BY 'XlimeLocal2026';
CREATE USER IF NOT EXISTS 'xlime_app'@'127.0.0.1' IDENTIFIED BY 'XlimeLocal2026';
ALTER USER 'xlime_app'@'localhost' IDENTIFIED BY 'XlimeLocal2026';
ALTER USER 'xlime_app'@'127.0.0.1' IDENTIFIED BY 'XlimeLocal2026';
GRANT ALL PRIVILEGES ON xlime_gear.* TO 'xlime_app'@'localhost';
GRANT ALL PRIVILEGES ON xlime_gear.* TO 'xlime_app'@'127.0.0.1';
FLUSH PRIVILEGES;
