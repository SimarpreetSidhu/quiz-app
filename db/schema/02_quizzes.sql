
DROP TABLE IF EXISTS quiz CASCADE;
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_title TEXT NOT NULL,
  quiz_description TEXT,
  creator_id INTEGER NOT NULL REFERENCES user(id),
  visibility BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  sharable_url TEXT UNIQUE
);
