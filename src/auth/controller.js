const { addUser, loginVerification } = require('./service');

const register = async (req, res) => {
    const { email, password, fullname } = req.body;

    const result = await addUser({ email, password, fullname });
    if (result) {
        return res.json({
            success: true,
            msg: 'register success',
        });
    } else {
        return res.status(400).json({
            success: false,
            msg: 'register failed',
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const result = await loginVerification(email, password);

    if (result) {
        const { refreshToken, ...data } = result;


        // const expCookie = new Date(Date.now() + 60 * 60 * 24 * 1000 * 1); // 1 hari
        const expCookie = new Date(Date.now() + 60 * 30 * 1000); // setengah jam | menyesuaikan dengan expired refresh token

        res.cookie('refresh-token', refreshToken, {
            expires: expCookie,
            httpOnly: true,
            // secure: true, // harus pakai https
            sameSite: 'strict',
        });

        return res.json({
            success: true,
            data,
        });
    } else {
        return res.status(400).json({
            success: false,
            msg: 'login failed',
        });
    }
};

module.exports = {
    register,
    login,
};
