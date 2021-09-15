const connPool = require('../configs/database');
const {
    hashPassword,
    comparePassword,
    generateToken,
    generateRefreshToken,
} = require('../utils/authentication');

const addUser = async (data) => {
    try {
        const userId = new Date().getTime();
        const password = await hashPassword(data.password);

        const query = `
            INSERT INTO users (userId, email, password, fullname)
            VALUES ('${userId}', '${data.email}', '${password}', '${data.fullname}')
        `;

        const [rows, fields] = await connPool.execute(query);

        console.log(rows);

        if (rows.affectedRows) return true;
        else return false;
    } catch (error) {
        console.error(error.message);
        return false;
    }
};

const loginVerification = async (email, password) => {
    try {
        const query = `SELECT userId, email, fullname, password FROM users WHERE email = '${email}'`;
        const [rows, fields] = await connPool.execute(query);

        const compare = await comparePassword(password, rows[0].password);

        if (compare) {
            const accessToken = generateToken(rows[0].userId, '1m');
            const refreshToken = generateRefreshToken(rows[0].userId, '30m');
            const dataUser = {
                id: rows[0].userId,
                email: rows[0].email,
                fullname: rows[0].fullname,
            };

            return {
                accessToken,
                refreshToken,
                dataUser,
            };
        }

        return false;
    } catch (error) {
        console.error(error.message);
        return false;
    }
};

const getDataUserId = async (userId) => {
    try {
        const query = `SELECT userId, email, fullname FROM users WHERE userId = '${userId}'`;
        const [rows, fields] = await connPool.execute(query);
        return {
            id: rows[0].userId,
            email: rows[0].email,
            fullname: rows[0].fullname,
        };
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

module.exports = {
    addUser,
    loginVerification,
    getDataUserId,
};
