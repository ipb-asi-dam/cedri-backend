const router = require('express').Router();
const models = require('../../../models');
const Occupation = models.occupation;
const { check, validationResult } = require('express-validator/check');

router.post('/', [
    check('name', 'fodasse')
        .exists()
        .withMessage('Attribute name can\'t be null')
        .isString()
        .withMessage('Attribute name is not a string')
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ success: false, errors: errors.array() });
    }
    const createdOccupation = await Occupation.create(req.body);
    if(createdOccupation)
        res.status(201).json({success: true, data: createdOccupation});
    else
        res.status(500).json({success: false, msg: 'Erro ao criar Occupation'});
});
module.exports = router;