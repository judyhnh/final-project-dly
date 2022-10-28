CREATE TABLE Users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username varchar(50) NOT NULL,
  password_hash varchar(50) NOT NULL,
  email varchar(50) NOT NULL
);

INSERT INTO Users
(username, password_hash, email)
VALUES
('Judy', 'hello123', 'judy@email.com');

SELECT * FROM users;
