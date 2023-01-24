const GoogleStrategy = require('passport-google-oauth2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
require('dotenv').config();
const { ExtractJwt } = require('passport-jwt');
const User = require('./models/userModel');

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          let existingUser = await User.findOne({ 'google.id': profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }
          console.log('Creating New User');
          const newUser = new User({
            method: 'google',
            google: {
              id: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
            },
          });
          await newUser.save();
          return done(null, newUser);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'secretKey',
      },
      async (payload, done) => {
        try {
          const user = payload.user;
          done(null, user);
        } catch (err) {
          done(err, false);
        }
      }
    )
  );
};
