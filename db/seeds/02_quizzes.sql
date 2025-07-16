-- Seed Quizzes
INSERT INTO quizzes (quiz_title, quiz_description, creator_id, visibility, created_at, sharable_url)
VALUES 
  ('JavaScript Basics', 'A quiz on JS fundamentals', 1, true, NOW(), 'js-basics-123'),
  ('Python Intro', 'Test your Python knowledge', 2, false, NOW(), 'py-intro-456');