const db = require('./connection');

const getPublicQuizzes = () => {
  return db.query('SELECT * FROM quizzes WHERE visibility = true;')
    .then(res => res.rows);
};

module.exports = { getPublicQuizzes };