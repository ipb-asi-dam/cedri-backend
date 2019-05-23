const router = require('express').Router();
const models = require('../../../../models');
const { param, check, validationResult } = require('express-validator/check');
const Investigator = models.investigator,
    User = models.user;
const mailer = require('../../../../config/global_modules/mailer-wrap');
const {isAdmin} = require('../../../../middleweres');

const shuffle = (word) => {
    let a = word.split("");
    const n = a.length;

    for(let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}
const makePassword = (lengthCharacter, lengthNumber, lengthSpecialCharacter) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '1234567890';
    const specialCharacters = '!@#$%&*_-+.,';
    const charactersLength = characters.length;
    const numbersLength = numbers.length;
    const specialCharacterLength = specialCharacters.length;

    for ( let i = 0; i < lengthCharacter; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    for ( let i = 0; i < lengthNumber; i++ ) {
        result += numbers.charAt(Math.floor(Math.random() * numbersLength));
    }
    for ( let i = 0; i < lengthSpecialCharacter; i++ ) {
        result += specialCharacters.charAt(Math.floor(Math.random() * specialCharacterLength));
    }
    
    return shuffle(result);
}
 
router.post('/', [
    isAdmin,
    check('email', 'Atributo email não pode ser nulo')
        .exists()
        .toString().trim()
        .isEmail().withMessage('O campo email está errado'),
    
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
    user.password = makePassword(4,3,1);
    try {
            const investigadorCreated = await models.sequelize.transaction(async (transaction) => {
                const userCreated = await User.create({email: user.email, password: user.password}, {transaction});
                const investigator = await Investigator.create({
                    ...user,
                    userId: userCreated.id
                }, {transaction});
                await mailer.newUserEmail({name: investigator.name, password: user.password, email: userCreated.email});
                return investigator;
            });
        return res.status(201).send({
            success: true, 
            data: await Investigator.scope('basic')
                .findOne(
                    {where: {id: investigadorCreated.id}
                })
        });
    } catch(err){
        console.log(err);
        res.status(500).send({success: false, msg: 'Erro ao criar investigador'})
    }
})

router.put('/:id', [
    param('id', 'Parametro id não pode ser nulo')
        .exists()
        .isNumeric({no_symbols: true})
        .withMessage('Id precisa ser um número'),
    check('email')
        .toString()
        .trim()
        .isEmail()
        .withMessage('Email não é válido')
        .optional(),
    check('password')
        .matches('[~!@#\$%\&*\-_=\+;:,\.]')
        .withMessage('Password precisa de um caracter especial')
        .matches('[0-9]*').withMessage('Password precisa conter números')
        .isLength({min: 8, max: 255}).withMessage('Password precisa ter no minimo 8 e no máximo 255 caracteres')
        .optional(),
],async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ success: false, errors: errors.array() });
    }
    const id = req.params.id;
    const user = req.body;
    try {
        await models.sequelize.transaction(async (transaction) => {
            const investigator = await Investigator.findByPk(id, {transaction});
            if(!investigator.isAdmin && id != investigator.id){
                console.log('entrou')
            }
            await Investigator.update(user, {
                where: {id: investigator.id}
            }, {transaction});
            await User.update(user, {
                where: {id: investigator.userId}
            }, {transaction});
        });
        res.status(200).send({success: true, msg: 'Usuário atualizado com sucesso!'})
    }catch(err) {
        console.log(err)
        return res.status(500).send({success: false, msg: 'Erro ao atualizar usuário.'});
    }
});

router.get('/', isAdmin,async (req, res) => {
    try {
        const users = await Investigator.scope('basic').findAll();
        res.status(200).send({success: true, data: users });
    }catch(err){
        return res.status(500).send({success: false, msg: 'Erro ao listar usuários.'});
    }
});

router.get('/:id', isAdmin,async (req, res) => {
    const id = req.params.id;
    try {
        const users = await Investigator.scope('basic').findOne({
            where: {
                id: id,
            }
        });
        res.status(200).send({success: true, data: users });
    }catch(err){
        return res.status(500).send({success: false, msg: 'Erro ao listar usuários.'});
    }
});
module.exports = router;