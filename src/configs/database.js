const mysql = require('mysql2/promise');

const connPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'auth-db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = connPool;