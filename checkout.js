const express = require('express');
const router = express.Router();
const db = require('../config');


router.get('/', async (req, res) => {
    const userId = req.session.user.id;
    
    try {
        
        const [cartItems] = await db.execute(
            `SELECT ci.quantity, p.name AS product_name, p.price 
             FROM cart_items ci
             INNER JOIN products p ON ci.product_id = p.id
             WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = ?)`,
            [userId]
        );

        
        let total = 0;
        for (const item of cartItems) {
            total += item.price * item.quantity;
        }

        
        res.render('checkout', { cartItems, total, user: req.session.user });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});


router.post('/', async (req, res) => {
    const { address, phone } = req.body;
    const userId = req.session.user.id;

    try {
        
        const [cartItems] = await db.execute(
            `SELECT ci.product_id, ci.quantity, p.price 
             FROM cart_items ci
             INNER JOIN products p ON ci.product_id = p.id
             WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = ?)`,
            [userId]
        );

        
        let total = 0;
        for (const item of cartItems) {
            total += item.price * item.quantity;
        }

        
        const [newOrderResult] = await db.execute(
            'INSERT INTO orders (user_id, total, status, address, phone) VALUES (?, ?, ?, ?, ?)', 
            [userId, total, 'в обработке', address, phone]
        );
        const orderId = newOrderResult.insertId;

        
        const orderItemsPromises = cartItems.map(item =>
            db.execute('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', 
                [orderId, item.product_id, item.quantity, item.price])
        );

        
        await Promise.all(orderItemsPromises);

        
        await db.execute('DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?)', [userId]);

        
        res.redirect('/checkout');
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        res.status(500).json({ success: false, message: 'Произошла ошибка при оформлении заказа' });
    }
});

module.exports = router;
