const router = require('express').Router();
const models = require('../../models');
const User = models.user;
const Investigator = models.investigator;
const bcrypt = require('bcryptjs');
const env = process.env.NODE_ENV || 'development';
const isProduction = process.env.NODE_ENV === 'production';
const { API_SECRET } = require('../../config/config.json')[env];
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');

router.post('/authenticate', [
    check('email')
        .exists()
        .withMessage('Atributo email não pode ser nulo')
        .toString()
        .trim()
        .isEmail()
        .withMessage('Email com formato inesperado'),

    check('password')
        .exists()
        .withMessage('Atributo password não pode ser nulo')
],async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ success: false, errors: errors.array() });
    }
    const user = req.body;
    try {
        const userReturn = await User.findOne({
            where: {
                email: user.email,
            }
        });
        const match = await bcrypt.compare(user.password, userReturn.dataValues.password);
        if(match){
            const dataJWT = await Investigator.scope('complete').findByPk(userReturn.dataValues.id);
            const token = jwt.sign({
                data: dataJWT,
            }, API_SECRET, {
                expiresIn: isProduction ? '9h' : '10000h',
            });
            return res.
                status(200)
                .send({
                    success: true,
                    token: token
                });
        } else {
            return res.
                status(401)
                .send({
                    success: false,
                    msg: 'Falha ao realizar autenticação!'
                });
        }
    } catch(err){
        return res.
                status(403)
                .send({
                    success: false,
                    msg: 'Falha ao realizar autenticação!'
                });
    }
});


module.exports = router;