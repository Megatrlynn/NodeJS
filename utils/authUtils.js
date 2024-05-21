const jwt = require('jsonwebtoken');

const secretKey = process.env.ACCESS_TOKEN_SECRET || 'turbodiesel';

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
};

module.exports = { generateAccessToken, secretKey };
