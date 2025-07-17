const db = require('../connection');

const getPublicQuizzes = () => {
  return db.query(`
    SELECT quizzes.id, quizzes.quiz_title, quizzes.quiz_description, users.username AS creator_name
    FROM quizzes
    JOIN users ON quizzes.creator_id = users.id
    WHERE quizzes.visibility = true;
    `)
    .then(res => res.rows);
};

module.exports = { getPublicQuizzes };