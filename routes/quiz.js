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

//GET route to attempt a quiz
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
//The goal: show/get/fetch the questions for quiz,
//          check the correct/incorrect saveAnswer,
//          save the score,
//          when score is saved, then save answers,
//          when everything is done, show the result (score)
//          if something goes wrong, throw an error msg.

router.post('/:id/submit', async (req, res) => {
  const quizId = req.params.id;
  const userAnswers = req.body;
  const userId = req.session.user_id;
  let score = 0;

  getQuestionsByQuizId(quizId)
    //when fetching the questions are done, loop through each question and check if each question matches the correct_answer. 
    // if it matches, then add 1point.
    .then(questions => {
      // Calculate the score
      questions.forEach(question => {
        const userAnswer = userAnswers[`question-${question.id}`];
        if (userAnswer === String(question.correct_answer)) {
          score++;
        }
      });

      // Save attempt and answers
      return saveAttempt(userId, quizId, score).then(attemptId => {
        // Save answers one by one (map to promises)
        const saveAnswersPromises = questions.map(question => {
          const selected = userAnswers[`question-${question.id}`];
          return saveAnswer(attemptId, question.id, selected);
        });

        // Wait for all answers saved
        return Promise.all(saveAnswersPromises).then(() => {
          return { questions, attemptId };
        });
      });
    })

    .then(({ questions }) => {
      // Render the result page
      res.render('result', {
        score,
        total: questions.length,
        questions,
        userAnswers,
        quizId
      });
    })
    .catch(err => {
      console.error('Error submitting quiz:', err);
      res.status(500).send('Something went wrong.');
    });
});

router.get('/new',(req,res) => {
  res.render('quiz_new')
});

module.exports = router;
