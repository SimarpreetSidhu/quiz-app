//const { useId } = require('react');
const db = require('../connection');
const { v4: uuidv4 } = require('uuid'); 

const insertQuizName = (quizTitle, quizDescription, userId, visibility) => {

  return db.query(`
  INSERT INTO QUIZZES (quiz_title, quiz_description, creator_id , visibility, sharable_url)
  VALUES ($1,$2,$3,$4,'')
  RETURNING id;
  `, [quizTitle, quizDescription, userId, visibility]);
};

const insertQuestions = (quizId, quizQuestion, questionPosition, quizAnswer) =>
{
  return db.query(`
    INSERT INTO questions (quiz_id, content, position, correct_answer)
    VALUES ($1,$2,$3,$4)`, [quizId, quizQuestion, questionPosition, quizAnswer]);
};

const updateShareableUrl = (quizId) =>
{
  const shareableUrl = `/quiz/${quizId}`;
  return db.query(`
    UPDATE QUIZZES 
    SET sharable_url=$1
    WHERE id = $2`, [shareableUrl,quizId]);
};

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
// const saveAttempt = (user_id, quiz_id, score) => {
//   const query = `
//     INSERT INTO attempts (user_id, quiz_id, score)
//     VALUES ($1, $2, $3)
//     RETURNING id;
//   `;
//   const params = [user_id, quiz_id, score];
//   return db.query(query, params)
//     .then(result => result.rows[0].id);
// };
const saveAttempt = async (userId, quizId, score) => {
  const sharableUrl = uuidv4();
  const result = await db.query(`
    INSERT INTO attempts (user_id, quiz_id, score, sharable_url)
    VALUES ($1, $2, $3, $4)
    RETURNING id, sharable_url;
  `, [userId, quizId, score, sharableUrl]);

  return result.rows[0]; // { id: ..., sharable_url: ... }
};

// share the results

const shareResults = async (sharableUrl) => {
  const query = `
    SELECT attempts.*, quizzes.quiz_title, users.name AS user_name
    FROM attempts
    JOIN quizzes ON quizzes.id = attempts.quiz_id
    JOIN users ON users.id = attempts.user_id
    WHERE attempts.sharable_url = $1
  `;

  const result = await db.query(query, [sharableUrl]);

  if (result.rows.length === 0) {
    throw new Error('No result found for that shareable link.');
  }

  return result.rows[0];
};

//save the answers
const saveAnswer = (attemptId, questionId, selectedAnswer) => {
  const query = `
    INSERT INTO answers (attempt_id, question_id, selected_answer)
    VALUES ($1, $2, $3);
  `;
  return db.query(query, [attemptId, questionId, selectedAnswer]);
};

//
const getQuizzesByUserId = (userId) => {
  const query = `
    SELECT * FROM quizzes
    WHERE creator_id = $1
    ORDER BY created_at DESC;
  `;
  return db.query(query, [userId])
    .then(result => result.rows);
};


const updateVisibility = (quizId, visibility) => {
  const query = `
    UPDATE quizzes
    SET visibility = $1
    WHERE id = $2;
  `;
  return db.query(query, [visibility, quizId]);
};

const getAttemptBySharableUrl = (sharableUrl) => {
  const query = `
    SELECT attempts.*, quizzes.quiz_title
    FROM attempts
    JOIN quizzes ON quizzes.id = attempts.quiz_id
    WHERE attempts.sharable_url = $1
  `;

  return db.query(query, [sharableUrl]).then(result => result.rows[0] || null);
};

const getAnswersByAttemptId = (attemptId) => {
  const query = `
    SELECT question_id, selected_answer
    FROM answers
    WHERE attempt_id = $1;
  `;
  return db.query(query, [attemptId])
    .then(result => result.rows)
    .catch(err => {
      console.error('Query Failed!: ', err.message);
      return [];
    });
};



module.exports = { getPublicQuizzes, getQuestionsByQuizId, getQuizById, saveAnswer, saveAttempt, insertQuizName ,insertQuestions,updateShareableUrl, getQuizzesByUserId, updateVisibility , getAttemptBySharableUrl, getAnswersByAttemptId};