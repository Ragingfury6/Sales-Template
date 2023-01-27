const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();
const User = require('./models/userModel');

module.exports = (passport) => {
  passport.use(
    // Uses google to log in
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          // If theres an existing user, let them in
          // If not, make a new user
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
  // Serialization and deserialization of users
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
