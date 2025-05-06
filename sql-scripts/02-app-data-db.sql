DROP DATABASE IF EXISTS `app_data`;
CREATE DATABASE IF NOT EXISTS `app_data`;
USE `app_data`;

-- Tabela: jednostka
CREATE TABLE jednostka (
    jednostka_id INT PRIMARY KEY AUTO_INCREMENT,
    nazwa VARCHAR(50) NOT NULL,
    skrot VARCHAR(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dodanie podstawowych jednostek
INSERT INTO jednostka (nazwa, skrot) VALUES 
    ("sztuka", "szt."),
    ("opakowanie", "opak.");

-- Tabela: nad_kategoria
CREATE TABLE nad_kategoria (
    nad_kategoria_id INT PRIMARY KEY AUTO_INCREMENT,
    nazwa VARCHAR(100) NOT NULL,
    opis TEXT,
    kolejnosc INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: rodzaj_produktu
CREATE TABLE rodzaj_produktu (
    rodzaj_produktu_id INT PRIMARY KEY AUTO_INCREMENT,
    nazwa VARCHAR(100) NOT NULL,
    opis TEXT,
    nad_kategoria_id INT,
    FOREIGN KEY (nad_kategoria_id) REFERENCES nad_kategoria(nad_kategoria_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: opakowanie
CREATE TABLE opakowanie (
    opakowanie_id INT PRIMARY KEY AUTO_INCREMENT,
    nazwa VARCHAR(100) NOT NULL,
    opis TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: skladnik
CREATE TABLE skladnik (
    skladnik_id INT PRIMARY KEY AUTO_INCREMENT,
    nazwa VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: stawka_vat
CREATE TABLE stawka_vat (
    stawka_vat_id INT PRIMARY KEY AUTO_INCREMENT,
    wartosc DECIMAL(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: kod_towaru
CREATE TABLE kod_towaru (
    kod_towaru_id INT PRIMARY KEY AUTO_INCREMENT,
    kod VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: kod_ean
CREATE TABLE kod_ean (
    kod_ean_id INT PRIMARY KEY AUTO_INCREMENT,
    kod VARCHAR(30) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: identyfikator
CREATE TABLE identyfikator (
    identyfikator_id INT PRIMARY KEY AUTO_INCREMENT,
    wartosc VARCHAR(30) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: produkt
CREATE TABLE produkt (
    produkt_id INT PRIMARY KEY AUTO_INCREMENT,
    nazwa VARCHAR(255) NOT NULL,
    waga DECIMAL(10,2),
    cena DECIMAL(10,2) NOT NULL,
    zdjecia TEXT, -- np. ["1", "2", "3"] lub ["https://..."]

    -- Flagi promocyjne
    super_produkt BOOLEAN DEFAULT FALSE,
    towar_polecany BOOLEAN DEFAULT FALSE,
    rekomendacja_sprzedawcy BOOLEAN DEFAULT FALSE,
    super_cena BOOLEAN DEFAULT FALSE,
    nowosc BOOLEAN DEFAULT FALSE,
    superjakosc BOOLEAN DEFAULT FALSE,
    rabat BOOLEAN DEFAULT FALSE,

    -- Flagi dostępności
    dostepny BOOLEAN DEFAULT TRUE,
    dostepne_od_reki BOOLEAN DEFAULT FALSE,
    dostepne_do_7_dni BOOLEAN DEFAULT FALSE,
    dostepne_na_zamowienie BOOLEAN DEFAULT FALSE,
    warto_kupic BOOLEAN DEFAULT FALSE,

    -- Bezglutenowość
    bezglutenowy BOOLEAN DEFAULT FALSE,

    -- Opis
    opis TEXT,

    -- Licznik wyświetleń
    wyswietlenia INT DEFAULT 0,

    -- Relacje
    rodzaj_produktu_id INT,
    jednostka_id INT,
    nad_kategoria_id INT,
    opakowanie_id INT,
    stawka_vat_id INT,
    kod_towaru_id INT,
    kod_ean_id INT,
    identyfikator_id INT,

    -- Kolumna składniki przechowująca ID składników w formie JSON lub tekstu
    skladniki TEXT, -- np. ["1", "2", "3"]

    -- Czas
    data_dodania TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_aktualizacji TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Klucze obce
    FOREIGN KEY (rodzaj_produktu_id) REFERENCES rodzaj_produktu(rodzaj_produktu_id),
    FOREIGN KEY (jednostka_id) REFERENCES jednostka(jednostka_id),
    FOREIGN KEY (nad_kategoria_id) REFERENCES nad_kategoria(nad_kategoria_id),
    FOREIGN KEY (opakowanie_id) REFERENCES opakowanie(opakowanie_id),
    FOREIGN KEY (stawka_vat_id) REFERENCES stawka_vat(stawka_vat_id),
    FOREIGN KEY (kod_towaru_id) REFERENCES kod_towaru(kod_towaru_id),
    FOREIGN KEY (kod_ean_id) REFERENCES kod_ean(kod_ean_id),
    FOREIGN KEY (identyfikator_id) REFERENCES identyfikator(identyfikator_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: zdjecie
CREATE TABLE zdjecie (
    zdjecie_id INT PRIMARY KEY AUTO_INCREMENT,
    produkt_id INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    opis VARCHAR(255),
    kolejnosc INT DEFAULT 0,
    FOREIGN KEY (produkt_id) REFERENCES produkt(produkt_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




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

