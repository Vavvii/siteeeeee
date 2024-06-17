const express = require('express');
const router = express.Router();
const db = require('../config');

router.get('/', (req, res) => {
    res.render('feedback', { success: false, error: false }); 
});

router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        await db.execute('INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)', [name, email, message]);
        res.render('feedback', { success: true, error: false }); 
    } catch (error) {
        console.error('Ошибка:', error);
        res.render('feedback', { success: false, error: true }); 
    }
});

module.exports = router;
