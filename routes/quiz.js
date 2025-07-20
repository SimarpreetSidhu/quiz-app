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

//POST route to submit answers
router.post('/quiz/:id/submit', (req, res) => {
  const userAnswers = req.body; // the answers that user selected
  const quizId = req.params.id;
  let score = 0;
  //retrieve correct answers for quiz from DB
  getQuestionsByQuizId(quizId)
  .then(questions => {
    questions.forEach(question => {
      const userAnswer = userAnswers[`question-${question.id}`];
      //count correct answers and score
      if (userAnswer === String(question.correct_answer)) {
        score++;
      }
    });

    // Render the result of score page after checking all answers
    res.render('result', {
      score,
      total: questions.length
    });
  })
  .catch(err => {
    console.error("Error submitting quiz:", err);
    res.status(500).send("Something went wrong!");
  });
});

router.get('/new', (req, res) => {
  res.render('quiz_new');
});


module.exports = router;
