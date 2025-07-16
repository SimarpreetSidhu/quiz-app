-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS user CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(255) NOT NULL,
  email TEXT NOT NULL UNIQUE
);
