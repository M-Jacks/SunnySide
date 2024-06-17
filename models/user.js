// models/user.js
const bcrypt = require('bcrypt');
const { pool } = require('@vercel/postgres');

async function createUser(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
        'INSERT INTO userslist (email, password) VALUES ($1, $2) RETURNING *',
        [email, hashedPassword]
    );
    return rows[0];
}

async function findUserByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM userslist WHERE email = $1', [email]);
    return rows[0];
}

module.exports = {
    createUser,
    findUserByEmail,
};
