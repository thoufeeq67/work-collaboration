require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../Models/userModel");



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in our db
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // If user exists, return the user
          return done(null, user);
        } else {
          // If user doesn't exist, create a new user
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            password: "null", // No password needed for Google sign-ins
          });
          return done(null, newUser);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serialize user id to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user based on id stored in session
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
