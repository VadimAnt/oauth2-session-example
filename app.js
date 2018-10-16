require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const passportSetup = require('./strategies/passport-setup');
const app = express();
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');

app.set('view engine', 'ejs');

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, //day
  keys: [process.env.COOKIE_SECRET]
}));

app.use(passport.initialize());
app.use(passport.session())

mongoose.connect(process.env.DB_STRING, () => {
  console.log('connected to mongoDB');
});

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

app.get('/auth/login')

app.listen(3000, () => {
  console.log('setup!');
});