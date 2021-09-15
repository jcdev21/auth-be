const connPool = require('../configs/database');

const getUser = async () => {
    try {
        const [rows, fields] = await connPool.execute('SELECT * FROM users');
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getUser,
}