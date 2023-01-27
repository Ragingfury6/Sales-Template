const express = require('express');
const passport = require('passport');
const googleAuthRouter = express.Router();
const jwt = require('jsonwebtoken');

// Simple router for /auth/google
googleAuthRouter.get(
  '/',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

// Redirected to after login
googleAuthRouter.get(
  '/callback',
  passport.authenticate('google', {
    successRedirect: '/profile',
  })
);

module.exports = googleAuthRouter;
