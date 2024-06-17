const express = require('express');
const router = express.Router();
const db = require('../config');


router.get('/', async (req, res) => {
    const userId = req.session.user.id;

    try {
        
        const [orders] = await db.execute(
            `SELECT id, total, status, created_at 
             FROM orders 
             WHERE user_id = ? 
             ORDER BY created_at DESC`,
            [userId]
        );

        res.render('orders', { orders, user: req.session.user });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).send('Произошла ошибка при загрузке заказов');
    }
});

module.exports = router;
