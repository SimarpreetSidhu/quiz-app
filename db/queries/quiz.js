const db = require('../connection');

const getPublicQuizzes = () => {
  return db.query(`
    SELECT id, quiz_title, quiz_description
    FROM quizzes
    WHERE quizzes.visibility = true;
    `)
    .then(res => res.rows);
};

module.exports = { getPublicQuizzes };