-- MovieHub database
CREATE DATABASE IF NOT EXISTS moviehub
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE moviehub;

DROP TABLE IF EXISTS movies;

CREATE TABLE movies (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title      VARCHAR(255) NOT NULL,
  genre      VARCHAR(50)  NOT NULL DEFAULT '',
  year       SMALLINT UNSIGNED NULL,
  status     ENUM('to-watch','watching','watched') NOT NULL DEFAULT 'to-watch',
  rating     TINYINT UNSIGNED NOT NULL DEFAULT 0,
  notes      TEXT NULL,
  date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO movies (title, genre, year, status, rating, notes) VALUES
('Spirited Away', 'Animation', 2001, 'watched', 5, 'Rewatch every autumn.'),
('Dune: Part Two', 'Sci-Fi', 2024, 'watching', 0, ''),
('The Grand Budapest Hotel', 'Comedy', 2014, 'to-watch', 0, 'Recommended by a friend.');
