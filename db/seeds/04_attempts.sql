-- Seed Attempts
INSERT INTO attempts (user_id, quiz_id, score, attempted_at, sharable_url)
VALUES
  (2, 1, 2, NOW(), 'attempt-bob-js'),
  (1, 2, 1, NOW(), 'attempt-alice-py');