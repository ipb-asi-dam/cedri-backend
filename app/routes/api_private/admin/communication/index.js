const router = require('express').Router();
const models = require('../../../../models');
const { check, validationResult } = require('express-validator/check');
const Communication = models.communication;

router.post('/', [
    check('name', 'Atributo name não pode ser nulo')
        .exists(),

    check('link', 'Atributo link não pode ser nulo')
        .exists()
        .isURL().withMessage('Atributo link não é um URL'),


], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
    }

    try {
        const communicationCreated = await Communication.create(req.body);
        res.status(201).json({ success: true, data: communicationCreated });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Erro ao criar Communication' });
    }
})

module.exports = router;