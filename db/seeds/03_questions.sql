-- Seed Questions
INSERT INTO questions (quiz_id, content, position, correct_answer)
VALUES
  (1, 'Is JavaScript case-sensitive?', 1, true),
  (1, 'Does "==" check type in JS?', 2, false),
  (2, 'Is Python dynamically typed?', 1, true),
  (2, 'Does Python use curly braces for blocks?', 2, false),
  (3, 'Was JavaScript created in just 10 days?', 1, true),
  (3, 'JavaScript is the same as Java.', 2, false),
  (3, 'Can JavaScript run outside the browser using Node.js?', 3, true),
  (3, 'Is JavaScript statically typed?', 4, false);
