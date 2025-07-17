const express = require('express');
const router  = express.Router();
const { getQuestionsByQuizId, getPublicQuizzes } = require('../db/queries/quiz');

//route to display all of public quizzes on homepage.
router.get('/', (req, res) => {
  getPublicQuizzes()
  .then(quizzes => {
    res.render('index', {quizzes});
  })
  .catch(err => {
    res.status(500).send('Error loading quizzes: ' + err.message);
  });
});

//route to attempt a quiz
//res.params.id = named route parameters
//render quiz.ejs and pass questions with the specific quizId.
router.get('/:id/attempt', (req, res) => {
  const quizId = req.params.id;
  getQuestionsByQuizId(quizId)
    .then(questions => {
      res.render('quiz', { questions, quizId });
    })
    .catch(err => {
      res.status(500).send('Error loading quiz questions: ' + err.message);
    });
});


module.exports = router;
