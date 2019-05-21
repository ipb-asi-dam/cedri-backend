const router = require('express').Router();
const models = require('../../../../models');
const { check, validationResult } = require('express-validator/check');
const Event = models.event;

router.post('/', [
    check('date', 'Atributo date não pode ser nulo')
        .exists(),
        // .isDateURI().withMessage('Atributo date não é uma data'),
    check('local', 'Atributo local não pode ser nulo')
        .exists()

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
    }

    try {
        const eventCreated = await Event.create(req.body);
        res.status(201).json({ success: true, data: eventCreated });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Erro ao criar Event' });
    }
})

module.exports = router;