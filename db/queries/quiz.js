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
    SELECT id, content, correct_answer
    FROM questions
    WHERE quiz_id = $1;
  `;
  return db.query(query, [quizId]) //quizId is value for replacing $1
    .then(result => result.rows)
    .catch(err => {
      console.error('Query Failed!: ', err.message);
    });
};

//get title of the quiz and description
const getQuizById = (quizId) => {
  return db.query(`
    SELECT id, quiz_title, quiz_description
    FROM quizzes
    WHERE id = $1;
  `, [quizId])
  .then(result => result.rows[0])
  .catch(err => {
    console.error('Query Failed!: ', err.message);
  });
};

//save the attempt
const saveAttempt = (userId, quizId, score) => {
  const query = `
    INSERT INTO attempts (user_id, quiz_id, score)
    VALUES ($1, $2, $3)
    RETURNING id;
  `;
  return db.query(query, [userId, quizId, score])
    .then(res => res.rows[0].id);
};

//save the answers
const saveAnswer = (attemptId, questionId, selectedAnswer) => {
  const query = `
    INSERT INTO answers (attempt_id, question_id, selected_answer)
    VALUES ($1, $2, $3);
  `;
  return db.query(query, [attemptId, questionId, selectedAnswer]);
};



module.exports = { getPublicQuizzes, getQuestionsByQuizId, getQuizById, saveAnswer, saveAttempt };