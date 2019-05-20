const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const HttpStatus = require('http-status-codes');
const { API_SECRET } = require('../config/config.json')[env];
const middlewares = {};

middlewares.isValidToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (req.method === 'OPTIONS') {
        return next();
    }
    if (token) {
        jwt.verify(token, API_SECRET, (error, decoded) => {
            if (error) {
                return res
                    .status(403)
                    .send({success: false, message: 'Your token is not valid! Please try to login again'});
            }

            req.user = decoded.data;
            return next();
        });
    } else {
        return res
            .status(HttpStatus.UNAUTHORIZED)
            .send({success: false, message: 'No token provided'});
    }
};

middlewares.isAdmin = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    const decoded = jwt.decode(token);

    console.log(decoded)
};

module.exports = middlewares;