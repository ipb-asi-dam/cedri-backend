const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const HttpStatus = require('http-status-codes');
const { API_SECRET } = require('../config/config.json')[env];
const middlewares = {};

function checkToken(token){
    
};
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
                    .send({success: false, message: 'Seu token é inválido! Por favor, tente entrar novamente'});
            }

            req.user = decoded.data;
            return next();
        });
    } else {
        return res
            .status(HttpStatus.UNAUTHORIZED)
            .send({success: false, message: 'Nenhum token fornecido!'});
    }
};

middlewares.isAdmin = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jwt.verify(token, API_SECRET, (error, decoded) => {
            if (error) {
                return res
                    .status(403)
                    .send({
                        success: false,
                        msg: 'Sem permissão para realizar essa ação'
                    });
            }
            if (decoded.isAdmin){
                next();
            } else {
                return res
                    .status(401)
                    .send({
                        success: false,
                        msg: 'Sem permissão para realizar essa ação'
                    });
            }
        });
    } else {
        return res
            .status(HttpStatus.UNAUTHORIZED)
            .send({success: false, message: 'Nenhum token fornecido!'});
    }

    
};

module.exports = middlewares;