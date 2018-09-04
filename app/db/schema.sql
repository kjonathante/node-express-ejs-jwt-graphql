DROP DATABASE IF EXISTS codebook_db;

CREATE DATABASE codebook_db;

USE codebook_db;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email_address VARCHAR (255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  gitlink VARCHAR (255),
  linkedin VARCHAR(255),
  photourl VARCHAR (255),
  PRIMARY KEY (id)
);

CREATE TABLE gitrepos (
  id INT NOT NULL AUTO_INCREMENT,
  repo_id VARCHAR(255),
  name VARCHAR(255),
  url VARCHAR(255),
  selected BOOLEAN,
  githubpage VARCHAR(255),
  screenshot VARCHAR(255),
  ghpagestatus INT,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE messages (
  id INT NOT NULL AUTO_INCREMENT,
  user_message TEXT,
  user_id INT NOT NULL,
  sender VARCHAR(255) NOT NULL,
  timeEntered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);



