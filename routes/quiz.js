const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.render('quiz');
}); 

router.get('/new',(req,res) => {
  res.render('quiz_new')
});

module.exports = router;
