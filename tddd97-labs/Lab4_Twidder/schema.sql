-- Drop tables if they exist
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS post;

-- Create user table
CREATE TABLE user (
    email VARCHAR(30) NOT NULL, 
    password VARCHAR(30) NOT NULL, 
    firstname VARCHAR(20) NOT NULL,
    familyname VARCHAR(20) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    city VARCHAR(20) NOT NULL,
    country VARCHAR(20) NOT NULL,
    token VARCHAR (500),
    CONSTRAINT pk_user PRIMARY KEY(email)
);

-- Create post table
CREATE TABLE post (
    post_from VARCHAR(30) NOT NULL, 
    post_to VARCHAR(30) NOT NULL, 
    content VARCHAR(500) NOT NULL,
    CONSTRAINT fk_user_email_from FOREIGN KEY(post_from) REFERENCES user(email),
    CONSTRAINT fk_user_email_to FOREIGN KEY(post_to) REFERENCES user(email)
);


-- Insert initial data into user table
INSERT INTO user (email, password, firstname, familyname, gender, city, country)
VALUES ('example1@example.com', '111', 'John', 'Doe', 'Male', 'New York', 'USA'),
       ('example2@example.com', '222', 'Jane', 'Doe', 'Female', 'Los Angeles', 'USA');

-- Insert initial data into post table
INSERT INTO post (post_from, post_to, content)
VALUES ('example1@example.com', 'example2@example.com', 'Hello Jane!'),
       ('example2@example.com', 'example1@example.com', 'Hi John!');

