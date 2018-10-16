const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const UserModel = require('../models/user-model');

passport.serializeUser((user, done) => {
  done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy({
      callbackURL: process.env.GOOGLE_CALLBACK,
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }, async (accessToken, refreshToken, profile, done) => {
      
      let user = await UserModel.findOne({ googleID: profile.id });
      if(!user) {
        user = new UserModel({
          username: profile.displayName,
          googleID: profile.id,
          thumbnail: profile._json.image.url,
        });
        await user.save();
      }

      done(null, user); // serializeUser
    }
  )
);