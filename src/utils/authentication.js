const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
} = process.env;

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

const comparePassword = async (passwordInput, passwordDb) => {
    return await bcrypt.compare(passwordInput, passwordDb);
}

const generateToken = (userId, expTime) => {
    return jwt.sign({id: userId}, ACCESS_TOKEN_SECRET, {expiresIn: expTime});
}

const generateRefreshToken = (userId, expTime) => {
    return jwt.sign({id: userId}, REFRESH_TOKEN_SECRET, {expiresIn: expTime});
}

const verifyToken = (token) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
}

const decodeToken = (token) => {
    return jwt.decode(token);
}

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken,
    decodeToken,
}