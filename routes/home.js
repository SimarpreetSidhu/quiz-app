const { getPublicQuizzes } = require('../db/queries/quiz');

router.get('/', (req, res) => {
  getPublicQuizzes()
    .then(quizzes => {
      res.render('home', { quizzes });
    });
});

