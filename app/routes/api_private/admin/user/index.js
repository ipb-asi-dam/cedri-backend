const router = require('express').Router();
const models = require('../../../../models');
const { check, validationResult } = require('express-validator/check');
const Investigator = models.investigator,
    User = models.user;

router.post('/', [
    check('email', 'Atributo email não pode ser nulo')
        .exists()
        .toString().trim()
        .isEmail().withMessage('O campo email está errado'),
    
    check('password', 'Atributo password não pode ser nulo')
        .exists()
        .matches('.*[~!@#\$%\\^&*()\\-_=+\\|\\[{\\]};:\'",<.>/?].*')
        .withMessage('Password precisa de um caracter especial')
        .matches('.*[0-9].*').withMessage('Password precisa conter números')
        .isLength({min: 8}).withMessage('Password precisa ter no minimo 8 caracteres'),
    check('occupationId', 'Atributo occupationId precisa ser um número')
        .optional()
        .isNumeric({no_symbols: true}),

    check('name', 'Atributo name não pode ser nulo')
        .exists()
        .isString().withMessage('Name precisa ser uma string'),
    
    check('isAdmin', 'Atributo isAdmin não pode ser nulo')
        .exists()
        .isBoolean().withMessage('isAdmin precisa ser booleano'),

    
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ success: false, errors: errors.array() });
    }
    const user  = req.body;

    try {
            const investigadorCreated = await models.sequelize.transaction(async (transaction) => {
            const userCreated = await User.create({email: user.email, password: user.password}, {transaction});
            return await Investigator.create({
                ...user,
                userId: userCreated.id
            }, {transaction});
        });
        return res.status(201).send({success: true, data: investigadorCreated});
    } catch(err){
        res.status(500).send({success: false, msg: 'Erro ao criar investigador'})
    }
})

module.exports = router;