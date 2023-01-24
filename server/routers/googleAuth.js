const express = require('express');
const passport = require('passport');
const googleAuthRouter = express.Router();
const jwt = require('jsonwebtoken');

googleAuthRouter.get(
  '/',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

googleAuthRouter.get(
  '/callback',
  passport.authenticate('google', { session: false }),
  (req, res, next) => {
    jwt.sign(
      { user: req.user },
      'secretKey',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          return res.json({ token: null });
        }
        // res.redirect('/profile');
        // console.log(req.user);
        res.json({ token });
        // req.logIn(req.user, (error) => {
        //   if (error) return next(error);
        //   return res.redirect('/profile');
        // });
      }
    );
  }
);

module.exports = googleAuthRouter;
