const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'secret_key', 
    resave: false,
    saveUninitialized: true,
}));


app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

const productsRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');
const checkoutRoutes = require('./routes/checkout');
const ordersRouter = require('./routes/orders');

app.use('/orders', ordersRouter);
app.use('/checkout', checkoutRoutes);
app.use( productsRoutes);
app.use( authRoutes);
app.use('/cart', cartRoutes);
app.use( feedbackRoutes);
app.use( adminRoutes);

app.get('/', (req, res) => {
    res.render('shop'); 
});

app.get('/delivery', (req, res) => {
    res.render('delivery'); 
});

app.get('/admin', (req, res) => {
    res.render('admin');
});
app.get('/shop', (req, res) => {
    res.render('shop');
});
app.use((req, res, next) => {
    res.status(404).set('Content-Type', 'text/html').sendFile(__dirname + '/views/404.ejs');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
