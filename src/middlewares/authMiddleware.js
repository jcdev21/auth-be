const {
    verifyToken,
    verifyRefreshToken,
    decodeToken,
    generateToken,
} = require('../utils/authentication');
const { getDataUserId } = require('../auth/service');

const auth = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({
            success: false,
            msg: 'token not exist',
        });
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
        const credential = verifyToken(token);
        console.log(credential, 'verify');

        if (credential) {
            req.user = credential;
            return next();
        }

        return res.status(400).json({
            success: false,
            msg: 'token invalid',
        });
    } catch (error) {
        if (error.message !== 'jwt expired') {
            return res.status(400).json({
                success: false,
                msg: 'token invalid',
            });
        }

        const decoded = decodeToken(token);
        console.log(decoded, 'decoded');
        if (decoded && decoded.exp < Date.now() / 1000) {
            /**
             * Jika menggunakan ini,
             * proses pemanggilan refresh token dari interceptors FE
             */
            // return res.status(401).json({
            //     success: false,
            //     tokenExpired: true,
            // });

            // Langsung mengolah access token baru, dengan refresh token dari cookie
            return prosesRefreshToken(req, res);
        }

        return res.status(403).json({
            success: false,
            msg: 'invalid authenticate',
        });
    }
};

const prosesRefreshToken = async (req, res) => {
    const { cookies } = req;
    console.log(cookies);
    if ('refresh-token' in cookies) {
        try {
            const refreshTokenCredential = verifyRefreshToken(
                cookies['refresh-token']
            );
            console.log(refreshTokenCredential, 'RF');

            if (refreshTokenCredential) {
                // disini bisa dilakukan pengecekan keamanan lanjutan
                // seperti : - ke Redis
                //           - dll

                const dataUser = await getDataUserId(refreshTokenCredential.id);
                const accessToken = generateToken(dataUser.id, '1m');
                console.log(accessToken);
                return res.json({
                    success: true,
                    data: {
                        accessToken,
                        dataUser,
                    },
                });
            }
        } catch (error) {
            console.log(error.message);
            return res.status(403).json({
                success: false,
                msg: 'invalid refresh token',
            });
        }
    } else {
        return res.status(403).json({
            success: false,
            msg: 'refresh token not exists',
        });
    }
};

module.exports = {
    auth,
};
