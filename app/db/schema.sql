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
  git_repo VARCHAR(255),
  users_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (users_id) REFERENCES users(id)
);



INSERT  INTO users (first_name, last_name, email_address, 
  password_hash, gitlink, linkedin,photourl)
VALUES ("Kit","Te","kjonthante@gmail.com","kit",
  "gitlink","linkdinlink","photo");
