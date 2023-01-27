const express = require('express');
const db = require('./database/connect');
const googleAuthRouter = require('./routers/googleAuth');
const passport = require('passport');
const session = require('express-session');
const path = require('path');

require('./database/passportConfig')(passport);
require('dotenv').config();

// express initialization
const app = express();
app.use(session({ secret: 'superSecret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('views', path.join(__dirname, '..', 'public/views'));
app.set('view engine', 'ejs');
db.connect();

// Checks if user is logged in
function isLoggedIn(req, res, next) {
  req.user ? next() : res.redirect('/');
}

app.use('/auth/google', googleAuthRouter);
// Front end routes
app.get('/', (req, res) => {
  res.render('index', { user: req.user?.google });
});
app.get('/about', isLoggedIn, (req, res) => {
  res.render('about', { user: req.user?.google });
});
//  passport.authenticate('jwt', { session: false }),

app.get('/profile', isLoggedIn, (req, res) => {
  console.log(req.user);
  res.render('homepage', { user: req.user?.google });
});
app.get('/contact', isLoggedIn, (req, res) => {
  console.log(req.user);
  res.render('contact', { user: req.user?.google });
});

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy();
    res.redirect('/');
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
