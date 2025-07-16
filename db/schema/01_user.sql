-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS user CASCADE;
CREATE TABLE user (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email TEXT NOT NULL UNIQUE
);
