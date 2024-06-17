require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { pool } = require('@vercel/postgres');
const initializePassport = require('./config/passport-config');
const authRoutes = require('./routes/auth');
const viewRoutes = require('./routes/views');

initializePassport(passport);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/', viewRoutes);

// Serve static files from the public directory
app.use(express.static('public'));

// Create users table if it doesn't exist


// createUsersTable();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});