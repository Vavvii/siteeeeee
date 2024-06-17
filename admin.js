const express = require('express');
const router = express.Router();
const db = require('../config');

router.post('/addProduct', (req, res) => {
    const { name, description, price, image } = req.body;


    if (!name || !description || !price || !image) {
        return res.status(400).json({ success: false, message: 'Не все поля формы заполнены.' });
    }

    db.execute('INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)', [name, description, price, image])
        .then(() => {
            res.status(200).json({ success: true, message: 'Товар успешно добавлен.' });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ success: false, message: 'Произошла ошибка при добавлении товара.' });
        });
});
router.get('/getProducts', async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products');
        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Произошла ошибка при загрузке продуктов.' });
    }
});
router.put('/editProduct/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    if (!name || !description || !price || !image) {
        return res.status(400).json({ success: false, message: 'Все поля должны быть заполнены.' });
    }

    try {
        const [result] = await db.execute('UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?', [name, description, price, image, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Продукт не найден.' });
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Произошла ошибка при редактировании продукта.' });
    }
});
router.delete('/deleteProducts', async (req, res) => {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
        return res.status(400).json({ success: false, message: 'Не указаны id продуктов для удаления.' });
    }

    try {
        const placeholders = ids.map(() => '?').join(',');
        const [result] = await db.execute(`DELETE FROM products WHERE id IN (${placeholders})`, ids);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Продукты не найдены.' });
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Произошла ошибка при удалении продуктов.' });
    }
});
router.get('/feedback_admin', async (req, res) => {
    try {
        const [feedback] = await db.execute('SELECT name, email, message, created_at FROM feedback ORDER BY created_at DESC');
        res.status(200).json(feedback);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Произошла ошибка при загрузке обратной связи.' });
    }
});
router.get('/orders', async (req, res) => {
    try {
        const [orders] = await db.execute(
            `SELECT o.id, o.user_id, o.total, o.status, o.created_at, o.address, o.phone, u.username 
             FROM orders o
             INNER JOIN users u ON o.user_id = u.id
             ORDER BY o.created_at DESC`
        );
        res.status(200).json(orders);
    } catch (err) {
        console.error('Ошибка при получении заказов:', err);
        res.status(500).json({ error: 'Произошла ошибка при загрузке заказов.' });
    }
});
module.exports = router;
