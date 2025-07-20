const express = require('express');
const router = express.Router();
const {
  getQuestionsByQuizId,
  getPublicQuizzes,
  getQuizById,
  saveAnswer,
  saveAttempt
} = require('../db/queries/quiz');

//route to display all of public quizzes on homepage.
router.get('/', (req, res) => {
  getPublicQuizzes()
    .then((quizzes) => {
      res.render('index', { quizzes });
    })
    .catch((err) => {
      res.status(500).send('Error loading quizzes: ' + err.message);
    });
});

//route to attempt a quiz
//res.params.id => request URL paramaters of specific ID = named route parameters
//render quiz.ejs and pass questions with the specific quizId.
router.get('/:id/attempt', (req, res) => {
  const quizId = req.params.id;
  //show quiz info & the questions
  Promise.all([getQuizById(quizId), getQuestionsByQuizId(quizId)])
    .then(([quiz, questions]) => {
      res.render('quiz', { questions, quiz, quizId });
    })
    .catch((err) => {
      res.status(500).send('Error loading quiz questions: ' + err.message);
    });
});

//POST route to submit answers
router.post('/:id/submit', async (req, res) => {
  const quizId = req.params.id;
  const userAnswers = req.body;
  const userId = req.session.user_id;
  let score = 0;

  try {
    const questions = await getQuestionsByQuizId(quizId);

    // Caliculate the score
    for (const question of questions) {
      const userAnswer = userAnswers[`question-${question.id}`];
      if (userAnswer === String(question.correct_answer)) {
        score++;
      }
    }

    // Save attempt and answers
    const attemptId = await saveAttempt(userId, quizId, score);
    for (const question of questions) {
      const selected = userAnswers[`question-${question.id}`];
      await saveAnswer(attemptId, question.id, selected);
    }

    res.render('result', {
      score,
      total: questions.length,
      questions,
      userAnswers
    });

  } catch (err) {
    console.error('Error submitting quiz:', err);
    res.status(500).send('Something went wrong.');
  }
});


module.exports = router;
