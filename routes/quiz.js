const express = require('express');
const router = express.Router();
const {
  getQuestionsByQuizId,
  getPublicQuizzes,
  getQuizById,
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

router.get('/new', (req, res) => {
  res.render('quiz_new');
});

module.exports = router;
