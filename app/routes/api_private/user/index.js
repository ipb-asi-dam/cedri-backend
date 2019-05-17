const router = require('express').Router();
const models = require('../../../models');
const { check, validationResult } = require('express-validator/check');
const Investigator = models.investigator,
    User = models.user,
    Occupation = models.occupation;

router.post('/', [
    check('email', 'Attribute email can\'t be null')
        .exists()
        .toString().trim()
        .isEmail().withMessage('The field email is wrong'),
    
    check('password', 'Attribute password can\'t be null'),
    check('occupationId', 'Attribute occupationId can\'t be null')
        .exists()
        .isNumeric({no_symbols: true}),

    check('name', 'Attribute name can\'t be null')
        .exists()
        .isString().withMessage('Name need to be a string'),
    
    check('isAdmin', 'Attribute isAdmin can\'t be null')
        .exists()
        .isBoolean().withMessage('isAdmin need to be a boolean'),

    
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ success: false, errors: errors.array() });
    }
    const user  = req.body;
// precisa fazer a verificação se esse usuário pode criar um novo investigador no banco de dados.

    const investigadorCreated = await models.sequelize.transaction(async (transaction) => {
        const occupation = await Occupation.findByPk(user.occupationId, {transaction});
        const userCreated = await User.create({email: user.email, password: user.password}, {transaction});
        return await Investigator.create({
            name: user.name,
            bio: user.bio,
            isAdmin: user.isAdmin,
            occupationId: occupation.id,
            userId: userCreated.id
        }, {transaction});
    });

    if(investigadorCreated){
        res.status(201).send({success: true, data: investigadorCreated});
    }else {
        res.status(500).send({success: false, msg: 'Erro ao criar investigador'})
    }

})

module.exports = router;