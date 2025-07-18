const express = require('express');
const router = express.Router();

/**
 * POST "/logout"
 * Clear session cookie and redirect to login page
*/
router.post("/", (req, res) => {
  req.session = null;
  res.redirect('/login');
});
  
module.exports = router;
