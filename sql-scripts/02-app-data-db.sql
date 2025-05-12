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
    ('sztuka', 'szt.'),
    ('opakowanie', 'opak.');

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
    skrot VARCHAR(50), -- Added skrot column
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
    dane_zdjecia LONGBLOB NOT NULL,
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

-- Tabela: zamowienie
CREATE TABLE `zamowienie` (
  `zamowienie_id` BIGINT NOT NULL AUTO_INCREMENT,
  `employee_id` BIGINT NOT NULL,
  `imie` VARCHAR(100) NOT NULL,
  `nazwisko` VARCHAR(100) NOT NULL,
  `mail` VARCHAR(255) NOT NULL,
  `primary_address_id` INT,
  `alternative_address_id` INT,
  `lista_id_produktow` TEXT, -- Przechowuje listę ID produktów w formacie JSON
  `laczna_cena` DECIMAL(10,2) NOT NULL,
  `data_dostawy` DATE,
  `zrealizowane` BOOLEAN DEFAULT FALSE,
  `numer_transakcji` VARCHAR(50), -- Dodane pole numer_transakcji
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`zamowienie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;






-- Dodanie nadkategorii miesnych
INSERT INTO nad_kategoria (nazwa, opis, kolejnosc) VALUES
  ('Drob', 'Produkty z drobiu', 1),
  ('Wolowina', 'Produkty z wolowiny', 2),
  ('Cielecina', 'Produkty z cieleciny', 3);

-- Dodanie rodzajow produktow dla kazdej nadkategorii
INSERT INTO rodzaj_produktu (nazwa, opis, nad_kategoria_id) VALUES
  -- Drob
  ('Udko z kurczaka', 'Mieso drobiowe - udko', 1),
  ('Piers z kurczaka', 'Mieso drobiowe - piers', 1),
  ('Skrzydelka', 'Mieso drobiowe - skrzydelka', 1),

  -- Wolowina
  ('Antrykot', 'Wolowina - antrykot', 2),
  ('Poledwica', 'Wolowina - poledwica', 2),
  ('Lopatka', 'Wolowina - lopatka', 2),

  -- Cielecina
  ('Cielecina z koscia', 'Cielecina - z koscia', 3),
  ('Sznycel cielecy', 'Cielecina - sznycel', 3),
  ('Lopatka cieleca', 'Cielecina - lopatka', 3);

-- Dodanie opakowan
INSERT INTO opakowanie (nazwa, skrot, opis) VALUES
  ('Tacka foliowa', 'tacka', 'Opakowanie foliowe zgrzewane'),
  ('Woreczek prozniowy', 'worek', 'Opakowanie prozniowe'),
  ('Kartonik', 'karton', 'Kartonowe opakowanie detaliczne');

-- Dodanie stawek VAT
INSERT INTO stawka_vat (wartosc) VALUES (5.00), (8.00), (23.00);

-- Dodanie kodow towarow
INSERT INTO kod_towaru (kod) VALUES ('MT0001'), ('MT0002'), ('MT0003');

-- Dodanie kodow EAN
INSERT INTO kod_ean (kod) VALUES ('5901234123457'), ('5901234123458'), ('5901234123459');

-- Dodanie identyfikatorow
INSERT INTO identyfikator (wartosc) VALUES ('ID001'), ('ID002'), ('ID003');

-- Dodanie skladnikow
INSERT INTO skladnik (nazwa) VALUES ('Mieso z kurczaka'), ('Sol'), ('Przyprawy');

-- Dodanie 3 przykladowych produktow
INSERT INTO produkt (
  nazwa, waga, cena, zdjecia,
  super_produkt, towar_polecany, rekomendacja_sprzedawcy, super_cena, nowosc, superjakosc, rabat,
  dostepny, dostepne_od_reki, dostepne_do_7_dni, dostepne_na_zamowienie, warto_kupic,
  bezglutenowy, opis, wyswietlenia,
  rodzaj_produktu_id, jednostka_id, nad_kategoria_id, opakowanie_id,
  stawka_vat_id, kod_towaru_id, kod_ean_id, identyfikator_id,
  skladniki
)
VALUES
  (
    'Udko z kurczaka swieze', 0.5, 12.99, '["1.jpg", "2.jpg"]',
    TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, FALSE,
    TRUE, TRUE, FALSE, FALSE, TRUE,
    FALSE, 'Soczyste udka z kurczaka, gotowe do pieczenia.', 10,
    1, 1, 1, 1,
    1, 1, 1, 1,
    '["1", "2", "3"]'
  ),
  (
    'Antrykot wolowy', 1.2, 45.00, '["3.jpg"]',
    FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, TRUE,
    TRUE, FALSE, TRUE, FALSE, FALSE,
    TRUE, 'Delikatny antrykot z wolowiny, sezonowany.', 20,
    4, 1, 2, 2,
    2, 2, 2, 2,
    '["2", "3"]'
  ),
  (
    'Sznycel cielecy', 0.3, 38.50, '["4.jpg"]',
    FALSE, FALSE, TRUE, FALSE, TRUE, TRUE, FALSE,
    TRUE, FALSE, FALSE, TRUE, TRUE,
    FALSE, 'Cienko krojony cielecy sznycel, idealny do smazenia.', 15,
    8, 2, 3, 3,
    1, 3, 3, 3,
    '["1", "3"]'
  );




  -- Drob
INSERT INTO produkt (
  nazwa, waga, cena, zdjecia,
  super_produkt, towar_polecany, rekomendacja_sprzedawcy, super_cena, nowosc, superjakosc, rabat,
  dostepny, dostepne_od_reki, dostepne_do_7_dni, dostepne_na_zamowienie, warto_kupic,
  bezglutenowy, opis, wyswietlenia,
  rodzaj_produktu_id, jednostka_id, nad_kategoria_id, opakowanie_id,
  stawka_vat_id, kod_towaru_id, kod_ean_id, identyfikator_id,
  skladniki
)
VALUES
  (
    'Piers z kurczaka smazona', 0.4, 14.50, '["5.jpg"]',
    TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE,
    TRUE, TRUE, FALSE, FALSE, FALSE,
    FALSE, 'Delikatna piers z kurczaka, gotowa do podgrzania.', 12,
    2, 1, 1, 2,
    1, 1, 1, 1,
    '["1", "2"]'
  ),
  (
    'Skrzydelka BBQ', 0.6, 13.20, '["6.jpg"]',
    FALSE, TRUE, FALSE, FALSE, TRUE, FALSE, FALSE,
    TRUE, FALSE, FALSE, TRUE, TRUE,
    FALSE, 'Skrzydelka w marynacie BBQ, idealne na grilla.', 18,
    3, 1, 1, 3,
    2, 1, 1, 1,
    '["1", "3"]'
  );

-- Wolowina
INSERT INTO produkt (
  nazwa, waga, cena, zdjecia,
  super_produkt, towar_polecany, rekomendacja_sprzedawcy, super_cena, nowosc, superjakosc, rabat,
  dostepny, dostepne_od_reki, dostepne_do_7_dni, dostepne_na_zamowienie, warto_kupic,
  bezglutenowy, opis, wyswietlenia,
  rodzaj_produktu_id, jednostka_id, nad_kategoria_id, opakowanie_id,
  stawka_vat_id, kod_towaru_id, kod_ean_id, identyfikator_id,
  skladniki
)
VALUES
  (
    'Poledwica wolowa sezonowana', 1.0, 79.90, '["7.jpg"]',
    TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE,
    TRUE, TRUE, FALSE, FALSE, TRUE,
    TRUE, 'Soczysta poledwica wolowa sezonowana na sucho.', 30,
    5, 1, 2, 2,
    3, 2, 2, 2,
    '["2", "3"]'
  ),
  (
    'Lopatka wolowa duszona', 1.5, 38.00, '["8.jpg"]',
    FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, TRUE,
    TRUE, FALSE, TRUE, FALSE, FALSE,
    FALSE, 'Lopatka wolowa idealna do pieczenia i duszenia.', 22,
    6, 1, 2, 1,
    2, 2, 2, 2,
    '["2", "3"]'
  );

-- Cielecina
INSERT INTO produkt (
  nazwa, waga, cena, zdjecia,
  super_produkt, towar_polecany, rekomendacja_sprzedawcy, super_cena, nowosc, superjakosc, rabat,
  dostepny, dostepne_od_reki, dostepne_do_7_dni, dostepne_na_zamowienie, warto_kupic,
  bezglutenowy, opis, wyswietlenia,
  rodzaj_produktu_id, jednostka_id, nad_kategoria_id, opakowanie_id,
  stawka_vat_id, kod_towaru_id, kod_ean_id, identyfikator_id,
  skladniki
)
VALUES
  (
    'Cielecina duszona z koscia', 1.1, 54.30, '["9.jpg"]',
    TRUE, FALSE, TRUE, FALSE, TRUE, TRUE, FALSE,
    TRUE, TRUE, FALSE, FALSE, TRUE,
    FALSE, 'Cielecina z koscia, idealna do gotowania i duszenia.', 16,
    7, 1, 3, 1,
    1, 3, 3, 3,
    '["1", "2", "3"]'
  ),
  (
    'Lopatka cieleca pieczona', 1.2, 49.90, '["10.jpg"]',
    FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE,
    TRUE, FALSE, FALSE, TRUE, FALSE,
    FALSE, 'Lopatka cieleca przyprawiona, gotowa do pieczenia.', 19,
    9, 2, 3, 2,
    2, 3, 3, 3,
    '["3"]'
  );

-- Przykładowe zapytania INSERT dla tabeli zamowienie
INSERT INTO `zamowienie` (`employee_id`, `imie`, `nazwisko`, `mail`, `primary_address_id`, `alternative_address_id`, `lista_id_produktow`, `laczna_cena`, `data_dostawy`, `zrealizowane`, `numer_transakcji`) VALUES (4, 'Piotr', 'Lewandowska', 'piotr.lewandowska@mail.com', NULL, 1, '{"4": "2"}', 189.28, '2025-05-15', TRUE, 'TRANS-63163-1');
INSERT INTO `zamowienie` (`employee_id`, `imie`, `nazwisko`, `mail`, `primary_address_id`, `alternative_address_id`, `lista_id_produktow`, `laczna_cena`, `data_dostawy`, `zrealizowane`, `numer_transakcji`) VALUES (4, 'Marcin', 'Wiśniewski', 'marcin.wiśniewski@mail.com', 1, NULL, '{"8": "15", "5": "2"}', 195.94, '2025-06-25', TRUE, 'TRANS-37571-2');
INSERT INTO `zamowienie` (`employee_id`, `imie`, `nazwisko`, `mail`, `primary_address_id`, `alternative_address_id`, `lista_id_produktow`, `laczna_cena`, `data_dostawy`, `zrealizowane`, `numer_transakcji`) VALUES (4, 'Katarzyna', 'Kowalska', 'katarzyna.kowalska@example.com', 1, NULL, '{"5": "20", "4": "13"}', 57.05, '2025-05-10', TRUE, 'TRANS-75845-3');
INSERT INTO `zamowienie` (`employee_id`, `imie`, `nazwisko`, `mail`, `primary_address_id`, `alternative_address_id`, `lista_id_produktow`, `laczna_cena`, `data_dostawy`, `zrealizowane`, `numer_transakcji`) VALUES (4, 'Marcin', 'Kowalska', 'marcin.kowalska@test.pl', 1, NULL, '{"5": "13", "9": "2", "2": "4"}', 161.4, '2025-05-10', FALSE, 'TRANS-52086-4');
INSERT INTO `zamowienie` (`employee_id`, `imie`, `nazwisko`, `mail`, `primary_address_id`, `alternative_address_id`, `lista_id_produktow`, `laczna_cena`, `data_dostawy`, `zrealizowane`, `numer_transakcji`) VALUES (4, 'Marcin', 'Wiśniewski', 'marcin.wiśniewski@mail.com', NULL, 1, '{"4": "20", "6": "20"}', 384.23, '2025-07-25', TRUE, 'TRANS-62759-5');

