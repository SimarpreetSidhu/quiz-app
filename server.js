// load .env data into process.env
require('dotenv').config();

// Web server config
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const { getUserById } = require('./db/queries/users');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.use(cookieSession({
  name: 'session',
  keys: [process.env.KEY]
}));

/**
*Middleware to make current user available in all EJS templates
*/
app.use(async (req, res, next) => {
  const user_id = req.session.user_id || null;

  if (user_id) {
    try {
      const user = await getUserById(user_id);
      res.locals.user = user || null;
    } catch (err) {
      console.error('Error fetching user:', err.message);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }

  next();
});



// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');
const quizRoutes = require('./routes/quiz');
const homeRoutes = require('./routes/home');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');
const userQuizzesRoutes = require ('./routes/user_quizzes');
const resultRoutes = require('./routes/result');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);
app.use('/quizzes', quizRoutes);
app.use('/', homeRoutes);
app.use('/login',loginRoutes);
app.use('/logout',logoutRoutes);
app.use('/', userQuizzesRoutes);
app.use('/results',resultRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

/*
app.get('/', (req, res) => {
  res.render('index');
});
*/

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
