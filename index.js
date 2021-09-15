const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();

// use plugin
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(helmet());
app.use(compression());
/** SETTING CORS
app.use(
    cors({
        origin: 'domain-frontend',
        credentials: true,
    })
);
*/

const { PORT } = process.env;


/** CONTOH PENERAPAN COOKIE
app.use('/signin', (req, res) => {
    const token = 'access-token';

    res.cookie('cookie-name', 'refresh-token', {
        // maxAge: isiwaktunya,
        // secure: true, //gunakan saat di production
        // sameSite: strict, //harus di domain yang sama, ex fe => domain.com || be => api.domain.com
        httpOnly: true,
    });

    return res.status(200).json(token);
});
*/


// routes
const authRouter = require('./src/auth/router');
const userRouter = require('./src/user/router');

// use routes
app.use('/auth', authRouter);
app.use('/users', userRouter);

const server = (port) => {
    try {
        app.listen(port, () => {
            console.log('Server running in port ' + port);
        });
    } catch (error) {
        console.error(error);
        process.exit();
    }
};

server(PORT);
