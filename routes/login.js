const express = require('express');
const router = express.Router();
const { getUserById } = require('../db/queries/users');

//route to login
router.get('/', (req, res) => {

  res.render('login', { user: null , error :null });

});

router.post(`/`, (req,res) => {
  const userId = req.body.id;
  getUserById(userId)
  .then(user => {
    if(user) {
      req.session.user_id = user.id;
      res.redirect('/quizzes');
    } else {
        // User not found: render login page with an error message
        res.status(401).render('login', { error: 'Invalid login', user: null });
      }
    })
    .catch(err => {
      // Database error 
      res.status(500).send('Server error: ' + err.message);
    });

});
  
module.exports = router;
