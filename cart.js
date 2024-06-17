const express = require('express');
const router = express.Router();
const db = require('../config');

router.get('/', async (req, res) => {
    try {
        const userId = req.session.user.id;
        const [cartItems] = await db.execute(
            `SELECT ci.quantity, p.name AS product_name, p.price 
             FROM cart_items ci
             INNER JOIN products p ON ci.product_id = p.id
             WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = ?)`,
            [userId]
        );
        res.render('cart', { cartItems, user: req.session.user });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

router.post('/add', async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.session.user.id;

    try {
        let [cartResult] = await db.execute('SELECT id FROM carts WHERE user_id = ?', [userId]);

        if (cartResult.length === 0) {
            const [newCartResult] = await db.execute('INSERT INTO carts (user_id) VALUES (?)', [userId]);
            cartResult = [{ id: newCartResult.insertId }];
        }

        const cartId = cartResult[0].id;

        
        const [existingItem] = await db.execute('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);

        if (existingItem.length > 0) {
            
            await db.execute('UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?', [quantity, cartId, productId]);
        } else {
            
            await db.execute('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, productId, quantity]);
        }

        res.status(200).json({ success: true, message: 'Товар успешно добавлен в корзину' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ success: false, message: 'Произошла ошибка при добавлении товара в корзину' });
    }
});
router.post('/remove/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
    const productId = req.body.productId;

    try {
        const [cartItem] = await db.execute(
            'SELECT id, quantity FROM cart_items WHERE id = ? AND product_id = ?',
            [itemId, productId]
        );

        if (cartItem.length > 0) {
            const currentQuantity = cartItem[0].quantity;

            if (currentQuantity > 1) {
                const newQuantity = currentQuantity - 1;
                await db.execute(
                    'UPDATE cart_items SET quantity = ? WHERE id = ? AND product_id = ?',
                    [newQuantity, itemId, productId]
                );
                res.status(200).json({ success: true, quantityLeft: newQuantity });
            } else {
                await db.execute(
                    'DELETE FROM cart_items WHERE id = ? AND product_id = ?',
                    [itemId, productId]
                );
                res.status(200).json({ success: true, quantityLeft: 0 });
            }
        } else {
            res.status(404).json({ success: false, message: 'Товар не найден' });
        }
    } catch (error) {
        console.error('Error removing item:', error);
        res.status(500).json({ success: false, message: 'Произошла ошибка при удалении товара' });
    }
});

module.exports = router;