const { getPublicQuizzes } = require('../db/queries/quizzes');

router.get('/', (req, res) => {
  getPublicQuizzes()
    .then(quizzes => {
      res.render('home', { quizzes });
    });
});

