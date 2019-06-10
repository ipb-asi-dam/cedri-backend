const router = require('express').Router();
const models = require('../../../../models');
const { param, check, validationResult } = require('express-validator/check');
const Media = models.media;

router.post('/', [
    check('description', 'Atributo name não pode ser nulo')
        .exists()

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
    }

    try {
        const mediaCreated = await Media.create(req.body);
        res.status(201).json({ success: true, data: mediaCreated });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Erro ao criar Media' });
    }
})

router.get('/', async (req, res) => {
    try {
        const media = await Media.scope('complete').findAll();
        res.status(200).send({ success: true, data: media });
    } catch (err) {
        return res.status(500).send({ success: false, msg: 'Erro ao listar media.' });
    }
});

router.get('/:id',async (req, res) => {
    const id = req.params.id;
    try {
        const media = await Media.scope('complete').findOne({
            where: {
                id: id,
            }
        });
        res.status(200).send({success: true, data: media });
    }catch(err){
        return res.status(500).send({success: false, msg: 'Erro ao listar media.'});
    }
});

router.put('/:id', [
    param('id', 'Id não pode ser nulo')
        .exists()
        .isNumeric({ no_symbols: true })
        .withMessage('Id precisa ser um número'),
    check('description')
        .optional(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
    }
    const id = req.params.id;
    const mediaUpdated = req.body;
    try {
        await models.sequelize.transaction(async (transaction) => {
            const media = await Media.findByPk(id, { transaction });
            await Media.update(mediaUpdated, {
                where: { id: media.id }
            }, { transaction });
        });
        res.status(200).send({ success: true, msg: 'Media atualizado com sucesso!' })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ success: false, msg: 'Erro ao atualizar Media.' });
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const media = await Media.destroy({
            where: { id: id }
        });
        res.status(200).send({ success: true, data: media });
    } catch (err) {
        return res.status(500).send({ success: false, msg: 'Erro ao apagar media.' });
    }
});

module.exports = router;