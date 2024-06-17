const mysql = require('mysql2/promise'); // Используем 'promise' для поддержки async/await

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'flower_shop'
});

module.exports = pool;
