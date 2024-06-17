// config/passport-config.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { pool } = require('@vercel/postgres');

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        try {
            const { rows } = await pool.query('SELECT * FROM userslist WHERE email = $1', [email]);
            if (rows.length > 0) {
                const user = rows[0];
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect' });
                }
            } else {
                return done(null, false, { message: 'No user with that email' });
            }
        } catch (error) {
            return done(error);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const { rows } = await pool.query('SELECT * FROM userslist WHERE id = $1', [id]);
            return done(null, rows[0]);
        } catch (error) {
            return done(error);
        }
    });
}

module.exports = initialize;
