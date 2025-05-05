DROP DATABASE IF EXISTS `authjwt`;
-- Create database with UTF8MB4 encoding
CREATE DATABASE IF NOT EXISTS `authjwt` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `authjwt`;

--
-- Table structure for table `employee`
--
DROP TABLE IF EXISTS `employee`;
CREATE TABLE `employee` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` char(80) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `consent_id` INT NULL UNIQUE COMMENT 'Reference to the specific consent record (one-to-one)',
  `primary_address_id` INT NULL UNIQUE COMMENT 'Reference to the primary address (one-to-one)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; -- Set UTF8MB4 encoding

--
-- Table structure for table `role`
--
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; -- Set UTF8MB4 encoding

--
-- Table structure for table `employee_roles`
--
DROP TABLE IF EXISTS `employee_roles`;
CREATE TABLE `employee_roles` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FK_ROLE_idx` (`role_id`),
  CONSTRAINT `FK_USER` FOREIGN KEY (`user_id`) 
    REFERENCES `employee` (`id`) 
    ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_ROLE` FOREIGN KEY (`role_id`) 
    REFERENCES `role` (`id`) 
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; -- Set UTF8MB4 encoding

--
-- Table structure for table `employee_consents`
--
DROP TABLE IF EXISTS `employee_consents`;
CREATE TABLE `employee_consents` (
    `consent_id` INT PRIMARY KEY AUTO_INCREMENT,
    `employee_id` bigint NOT NULL, -- Changed to bigint to match employee.id
    `rodo_consent` BOOLEAN DEFAULT FALSE,
    `terms_consent` BOOLEAN DEFAULT FALSE,
    `marketing_consent` BOOLEAN DEFAULT FALSE,
    `consent_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `consent_details` TEXT NULL, -- Added consent_details based on previous script
    FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; -- Set UTF8MB4 encoding

--
-- Table structure for table `addresses`
--
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE `addresses` (
    `address_id` INT PRIMARY KEY AUTO_INCREMENT,
    `employee_id` bigint NOT NULL, -- Changed to bigint to match employee.id
    `street` VARCHAR(100) NOT NULL,
    `building_number` VARCHAR(20) NOT NULL,
    `apartment_number` VARCHAR(20),
    `postal_code` VARCHAR(6) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `voivodeship` VARCHAR(50),
    `district` VARCHAR(100),
    `commune` VARCHAR(100),
    `country` VARCHAR(255) NULL, -- Added country based on previous script
    `phone_number` VARCHAR(15),
    FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; -- Set UTF8MB4 encoding

-- Add foreign key constraints to employee table after all tables are created
ALTER TABLE `employee`
ADD CONSTRAINT `fk_employee_consent` FOREIGN KEY (`consent_id`) REFERENCES `employee_consents`(`consent_id`) ON DELETE SET NULL,
ADD CONSTRAINT `fk_employee_primary_address` FOREIGN KEY (`primary_address_id`) REFERENCES `addresses`(`address_id`) ON DELETE SET NULL;

--
-- Dumping data for table `employee`
--
-- NOTE: The passwords are encrypted using BCrypt
--
-- Default passwords here are: admin
--
INSERT INTO `employee` (username, password, first_name, last_name, email)
VALUES 
('admin', '$2a$12$m3ZBICrETR7kXtjOcbEZreRM1MnIcUlZ98QVeb7di4B4fm.sxwHXS', 'Admin', 'Admin', 'admin@admin.com'),
('manager', '$2a$12$m3ZBICrETR7kXtjOcbEZreRM1MnIcUlZ98QVeb7di4B4fm.sxwHXS', 'Test', 'Manager', 'test@manager.com'),
('employee', '$2a$12$m3ZBICrETR7kXtjOcbEZreRM1MnIcUlZ98QVeb7di4B4fm.sxwHXS', 'Test', 'Employee', 'test@employee.com');

--
-- Dumping data for table `role`
--
INSERT INTO `role` (name)
VALUES 
('ROLE_EMPLOYEE'),('ROLE_MANAGER'),('ROLE_ADMIN');

--
-- Dumping data for table `employee_roles`
--
INSERT INTO `employee_roles` (user_id, role_id)
VALUES 
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(3, 1);

SET FOREIGN_KEY_CHECKS = 1;

