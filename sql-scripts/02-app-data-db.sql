DROP DATABASE IF EXISTS `app_data`;
CREATE DATABASE IF NOT EXISTS `app_data`;
USE `app_data`;
--
-- Example table structure for app data
--
DROP TABLE IF EXISTS `example_data`;
CREATE TABLE `example_data` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `data_cell_1` INT,
  `data_cell_2` VARCHAR(20),
  `timestamp_cell` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
INSERT INTO `example_data` (id, data_cell_1,data_cell_2)
VALUES
(1, 1,'example'),
(2, 2,'example'),
(3, 3,'example'),
(4, 4,'example'),
(5, 5,'example'),
(6, 6,'example');
