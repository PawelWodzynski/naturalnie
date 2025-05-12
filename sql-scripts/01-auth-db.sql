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
  `alternative_address_id` INT NULL UNIQUE COMMENT 'Reference to the alternative address (one-to-one, optional)', -- Added alternative_address_id
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
-- Table structure for table `addresses` (Primary Address)
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
    `nip` VARCHAR(10) NULL COMMENT 'NIP (Tax Identification Number), optional',
    `company_name` VARCHAR(255) NULL COMMENT 'Company Name, optional',
    FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; -- Set UTF8MB4 encoding

--
-- Table structure for table `alternative_addresses` (Alternative Address)
--
DROP TABLE IF EXISTS `alternative_addresses`;
CREATE TABLE `alternative_addresses` (
    `address_id` INT PRIMARY KEY AUTO_INCREMENT,
    -- No employee_id here, linked via employee.alternative_address_id
    `street` VARCHAR(100) NOT NULL,
    `building_number` VARCHAR(20) NOT NULL,
    `apartment_number` VARCHAR(20),
    `postal_code` VARCHAR(6) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `voivodeship` VARCHAR(50),
    `district` VARCHAR(100),
    `commune` VARCHAR(100),
    `country` VARCHAR(255) NULL,
    `phone_number` VARCHAR(15),
    `nip` VARCHAR(10) NULL COMMENT 'NIP (Tax Identification Number), optional',
    `company_name` VARCHAR(255) NULL COMMENT 'Company Name, optional'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; -- Set UTF8MB4 encoding

-- Add foreign key constraints to employee table after all tables are created
ALTER TABLE `employee`
ADD CONSTRAINT `fk_employee_consent` FOREIGN KEY (`consent_id`) REFERENCES `employee_consents`(`consent_id`) ON DELETE SET NULL,
ADD CONSTRAINT `fk_employee_primary_address` FOREIGN KEY (`primary_address_id`) REFERENCES `addresses`(`address_id`) ON DELETE SET NULL,
ADD CONSTRAINT `fk_employee_alternative_address` FOREIGN KEY (`alternative_address_id`) REFERENCES `alternative_addresses`(`address_id`) ON DELETE SET NULL; -- Added FK for alternative address

--
-- Dumping data for table `employee`
--
-- NOTE: The passwords are encrypted using BCrypt
--
-- Default passwords here are: admin
--
INSERT INTO `employee` (username, password, first_name, last_name, email)
VALUES 
("admin", "$2a$12$m3ZBICrETR7kXtjOcbEZreRM1MnIcUlZ98QVeb7di4B4fm.sxwHXS", "Admin", "Admin", "admin@admin.com"),
("manager", "$2a$12$m3ZBICrETR7kXtjOcbEZreRM1MnIcUlZ98QVeb7di4B4fm.sxwHXS", "Test", "Manager", "test@manager.com"),
("employee", "$2a$12$m3ZBICrETR7kXtjOcbEZreRM1MnIcUlZ98QVeb7di4B4fm.sxwHXS", "Test", "Employee", "test@employee.com");

--
-- Dumping data for table `role`
--
INSERT INTO `role` (name)
VALUES 
("ROLE_EMPLOYEE"),("ROLE_MANAGER"),("ROLE_ADMIN");

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



--
-- Dodanie użytkownika optiq
--
INSERT INTO `employee` (username, password, first_name, last_name, email)
VALUES 
("optiq", "$2a$12$MzePs703H2OZ/huNjBPEPONrCoYHUA0.UzIlZuGv.00AiJl3tbCPi", "Jakub", "Sniegocki", "jakub.sniegocki@optiq.pl");

-- Zakładamy, że to ID = 4 (bo poprzednie 3 to admin/manager/employee)
-- Zakładamy też, że ROLE_ADMIN ma ID = 3
-- Jeśli role się wczytują w tej samej kolejności co wcześniej

--
-- Przypisanie roli ADMIN do optiq
--
INSERT INTO `employee_roles` (user_id, role_id)
VALUES (4, 3);

--
-- Dodanie zgód dla optiq
--
INSERT INTO `employee_consents` (employee_id, rodo_consent, terms_consent, marketing_consent, consent_details)
VALUES (4, TRUE, TRUE, FALSE, 'Użytkownik wyraził zgodę na RODO i regulamin.');

-- Pobierz ID zgody
SET @consent_id := LAST_INSERT_ID();

--
-- Dodanie adresu głównego dla optiq
--
INSERT INTO `addresses` (employee_id, street, building_number, apartment_number, postal_code, city, voivodeship, district, commune, country, phone_number, nip, company_name)
VALUES (4, 'ul. Przykładowa', '12A', '5', '00-001', 'Warszawa', 'Mazowieckie', 'Warszawski', 'Warszawa', 'Polska', '123456789', NULL, NULL);

-- Pobierz ID adresu głównego
SET @primary_address_id := LAST_INSERT_ID();

--
-- Dodanie adresu alternatywnego dla optiq (z NIP i Firmą)
--
INSERT INTO `alternative_addresses` (street, building_number, apartment_number, postal_code, city, voivodeship, district, commune, country, phone_number, nip, company_name)
VALUES ('ul. Zapasowa', '33B', NULL, '00-002', 'Warszawa', 'Mazowieckie', 'Warszawski', 'Warszawa', 'Polska', '987654321', '1234567890', 'Optiq Solutions');

-- Pobierz ID adresu alternatywnego
SET @alternative_address_id := LAST_INSERT_ID();

--
-- Uzupełnienie relacji w employee
--
UPDATE `employee`
SET 
  consent_id = @consent_id,
  primary_address_id = @primary_address_id,
  alternative_address_id = @alternative_address_id
WHERE id = 4;
