DROP DATABASE IF EXISTS test_db;

CREATE DATABASE test_db;

USE test_db;

CREATE TABLE items (
  id INT NOT NULL AUTO_INCREMENT,
  item VARCHAR(255),
  PRIMARY KEY (id)
);

INSERT INTO items (item) VALUES ('item1'),('item2'),('item3'),('item4');