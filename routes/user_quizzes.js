const express = require('express');
const router = express.Router();

const { getQuizzesByUserId, getUserById } = require('../db/queries/quiz');

//Fetch all the questions by this user id
router.get('/dashboard', (req, res) => {
  const userId = req.session.user_id;
  //if not logged in, direcrt to log-in page.
  if (!userId) {
    return res.redirect('/login'); 
  }
  getQuizzesByUserId(userId)
    .then(quizzes => {
      console.log('Quizzes for user:', quizzes); // 👈 log this
      res.render('user_quizzes', { quizzes });
    })
    .catch(err => {
      res.status(500).send('Error Reading your quizzes: ' + err.message);
    });
});

router.post('/login', (req, res) => {
  const userId = req.body.user_id;

  if (!userId) {
    return res.render('login', { error: 'User ID is required' });
  }

  getUserById(userId)
    .then(user => {
      if (!user) {
        return res.render('login', { error: 'User not found' });
      }
      // After successfully user logged in, redirect to the homepage.
      req.session.user_id = user.id;
      res.redirect('/');
    })
    .catch(err => {
      console.error('Login error:', err);
      res.status(500).send('Server error');
    });
});

module.exports = router;