const express = require('express');
const router = express.Router();
const db = require('../config');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM products');
        res.render('index', { products: rows, user: req.session.user });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});


router.get('/shop', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM products');
        res.render('shop', { products: rows, user: req.session.user });
    } catch (err) {
        console.log(err);
        res.redirect('/admin');
    }
});

router.get('/product/:id', (req, res) => {
    const productId = req.params.id;
    db.execute('SELECT * FROM products WHERE id = ?', [productId])
        .then(([rows]) => {
            if (rows.length > 0) {
                res.render('product', { product: rows[0] });
            } else {
                res.redirect('/');
            }
        })
        .catch(err => console.log(err));
});

router.get('/products', async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products');
        res.render('products', { products }); 
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).send('Произошла ошибка при получении продуктов.');
    }
});


module.exports = router;
