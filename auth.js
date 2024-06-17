const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('../config');

router.use(session({
    secret: 'secret_key', 
    resave: false,
    saveUninitialized: true,
}));

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.user = user; 
                return res.json({ success: true });
            }
        }
        res.redirect('/login?error=1');
    } catch (err) {
        console.log(err);
        res.redirect('/login?error=1');
    }
});

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const [userRows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (userRows.length > 0) {
            return res.json({ success: false, message: 'Username already taken.' });
        }
        
        const [emailRows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (emailRows.length > 0) {
            return res.json({ success: false, message: 'Email already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: 'An error occurred during registration.' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(); 
    res.redirect('/');
});

router.get('/checkAdmin', async (req, res) => {
    const user = req.session.user; 
    if (user && user.username === 'admin') { 
        res.json({ isAdmin: true });
    } else {
        res.json({ isAdmin: false });
    }
});


module.exports = router;
