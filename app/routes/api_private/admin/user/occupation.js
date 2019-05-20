const router = require('express').Router();
const models = require('../../../../models');
const Occupation = models.occupation;
const { check, validationResult } = require('express-validator/check');

router.post('/', [
    check('name', 'Atributo nome não pode ser nulo')
        .exists()
        .isString()
        .withMessage('Atributo nome não é uma string')
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ success: false, errors: errors.array() });
    }
    try {
        const createdOccupation = await Occupation.create(req.body);
        res.status(201).json({success: true, data: createdOccupation});
    } catch(err){
        res.status(500).json({success: false, msg: 'Erro ao criar Occupation'});
    }
});
module.exports = router;