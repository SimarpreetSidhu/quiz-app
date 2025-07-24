const express = require('express');
const router = express.Router();
const {
  getQuestionsByQuizId,
  getPublicQuizzes,
  getQuizById,
  saveAnswer,
  saveAttempt,
  insertQuizName,
  insertQuestions,
  updateShareableUrl,
  updateVisibility,
  getQuizzesByUserId
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
  const shareUrl = `${req.protocol}://${req.get('host')}`;
  //show quiz info & the questions
  Promise.all([getQuizById(quizId), getQuestionsByQuizId(quizId)])
    .then(([quiz, questions]) => {
      res.render('quiz', { questions, quiz, quizId, shareUrl });
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

  try {
    const questions = await getQuestionsByQuizId(quizId);

    questions.forEach(question => {
      const userAnswer = userAnswers[`question-${question.id}`];
      if (userAnswer === String(question.correct_answer)) {
        score++;
      }
    });

    const { id: attemptId, sharable_url } = await saveAttempt(userId, quizId, score);
    const sharableUrl = sharable_url;

    const saveAnswersPromises = questions.map(question => {
      const selected = userAnswers[`question-${question.id}`];
      return saveAnswer(attemptId, question.id, selected);
    });

    await Promise.all(saveAnswersPromises);

    res.render('result', {
      score,
      total: questions.length,
      questions,
      userAnswers,
      quizId,
      sharableUrl,
      isSharedView: false
    });
  } catch (err) {
    console.error('Error submitting quiz:', err);
    res.status(500).send('Something went wrong.');
  }
});

router.get('/new', (req, res) => {
  res.render('quiz_new');
});

router.post('/new', async (req, res) => {
  try {
    const userID = req.session.user_id;

    if (!userID) {
      return res.status(401).json({ error: 'User must be logged in to create quiz.' });
    }

    const bodyKeys = Object.keys(req.body);
    const numQuestions = (bodyKeys.length - 2) / 3;
    console.log('Request Body:', req.body);
    console.log('Number of questions:', numQuestions);

    const quiz_title = req.body.quiz_title;
    const quiz_description = req.body.quiz_description;

    const isPublic = req.body.public === 'true';

    const result = await insertQuizName(quiz_title, quiz_description, userID, isPublic);
    const newQuizId = result.rows[0].id;

    await updateShareableUrl(newQuizId);

    for (let i = 1; i <= numQuestions; i++) {
      const quiz_question = req.body[`quiz_question${i}`];
      const quiz_position = req.body[`question_position_${i}`];
      const quiz_answer = req.body[`answer${i}`];

      if (!quiz_question || !quiz_answer) {
        console.log(`Skipping question ${i} due to missing data.`);
        continue;
      }

      await insertQuestions(newQuizId, quiz_question, quiz_position, quiz_answer);
    }

    res.status(200).json({ quizId: newQuizId });
  } catch (err) {
    console.error('Error in /quizzes/new:', err);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

router.get('/:id', (req, res) => {
  res.render('quiz');
});

router.post('/:id/visibility', (req, res) => {
  const quizId = req.params.id;
  const visibility = req.body.visibility;
  //update/change the visibility in data 
  updateVisibility(quizId, visibility)
    .then(() => res.sendStatus(200))
    .catch(err => {
      console.error('Failed to change visibility:', err.message);
      res.status(500).send('Error changing visibility');
    });
});

router.get('/:id/share', async (req, res) => {
  const quizId = req.params.id;

  try {
    const quiz = await getQuizById(quizId);
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }

    res.render('quizzes_list', { quizzes: [quiz] });
  } catch (err) {
    console.error('Error fetching quiz for sharing:', err);
    res.status(500).send('Something went wrong.');
  }
});


module.exports = router;