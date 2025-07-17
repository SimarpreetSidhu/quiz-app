const { getPublicQuizzes } = require('../db/queries/quiz');

router.get('/home', (req, res) => {
  getPublicQuizzes()
    .then(quizzes => {
      res.render('home', { quizzes });
    });
});

