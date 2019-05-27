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
                    .send({success: false, msg: 'Token é inválido! Por favor, tente entrar novamente'});
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
                        msg: 'Token é inválido! Por favor, tente entrar novamente'
                    });
            }
            if (decoded.data.isAdmin){
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

middlewares.hasPermission = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    const id = req.params.id;
    jwt.verify(token, API_SECRET, (error, decoded) => {
        if (error) {
            return res
                .status(403)
                .send({
                    success: false,
                    msg: 'Token é inválido! Por favor, tente entrar novamente'
                });
    }
        if (!decoded.data.isAdmin && decoded.data.id != id || !decoded.data.isAdmin && req.body.isAdmin !== undefined){
            return res
                .status(401)
                .send({
                    sucess: false,
                    msg: "Você não tem permissão realizer essa ação"
                })
        } else {
            return next();
        }
    });
};

module.exports = middlewares;