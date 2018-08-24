DROP DATABASE IF EXISTS codebook_db;

CREATE DATABASE codebook_db;

USE codebook_db;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email_address VARCHAR (255),
  username VARCHAR (255),
  password_hash VARCHAR(255),
  password_salt VARCHAR (255),
  gitlink VARCHAR (255),
  linknin VARCHAR(255),
  photourl VARCHAR (255),
  PRIMARY KEY (id)
);

CREATE TABLE gitrepos (
  id INT NOT NULL AUTO_INCREMENT,
  git_repo VARCHAR(255),
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);



INSERT INTO users SET ("Kit","Te","kjonthante@gmail.com","kit","kit","kit","gitlink","linkdinlink","photo");