// routes/auth.js
const express = require('express');
const passport = require('passport');
const { createUser, findUserByEmail } = require('../models/user');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (await findUserByEmail(email)) {
            return res.status(400).send('User already exists');
        }
        const user = await createUser(email, password);
        res.status(201).send(user);
    } catch (error) {
        res.status(600).send(error.message);
    }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.send(req.user);
});

router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.send('Logged out');
    });
});

module.exports = router;
