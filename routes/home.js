const express = require('express');
const router = express.Router();

const { getPublicQuizzes } = require('../db/queries/quiz');

router.get('/', (req, res) => {
  getPublicQuizzes()
    .then(quizzes => {
      res.render('index', { quizzes });
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

module.exports = router;