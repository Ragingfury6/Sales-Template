const express = require('express');
const db = require('./database/connect');
const googleAuthRouter = require('./routers/googleAuth');
const passport = require('passport');
require('./database/passportConfig')(passport);
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
db.connect();

app.use('/auth/google', googleAuthRouter);

app.get('/', (req, res) => {
  res.render('index');
});
//  passport.authenticate('jwt', { session: false }),

app.get('/profile', (req, res) => {
  console.log(req.user);
  res.send('Welcome In!');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
