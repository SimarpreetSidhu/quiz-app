const db = require('../connection');


//get all public questions
const getPublicQuizzes = () => {
  return db.query(`
    SELECT id, quiz_title, quiz_description
    FROM quizzes
    WHERE quizzes.visibility = true;
    `)
    .then(res => res.rows)
    .catch(err => {
      console.error('Query Failed!: ', err.message);
    });
};

//get all the questions by for a spevific quiz (with quizId)
const getQuestionsByQuizId = (quizId) => {
  const query = `
    SELECT id, content
    FROM questions
    WHERE quiz_id = $1;
  `;
  return db.query(query, [quizId]) //quizId is value for replacing $1
    .then(result => result.rows)
    .catch(err => {
      console.error('Query Failed!: ', err.message);
    });
};

module.exports = { getPublicQuizzes, getQuestionsByQuizId };