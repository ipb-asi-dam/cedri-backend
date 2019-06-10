const router = require('express').Router();
const models = require('../../../../models');
const { param, check, validationResult } = require('express-validator/check');
const News = models.news;

router.post('/', [
    check('photo', 'Atributo photo não pode ser nulo')
        .exists(),
    check('description', 'Atributo description não pode ser nulo')
        .exists(),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
    }

    try {
        const newsCreated = await News.create(req.body);
        res.status(201).json({ success: true, data: newsCreated });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Erro ao criar News' });
    }
})

router.get('/', async (req, res) => {
    try {
        const news = await News.scope('complete').findAll();
        res.status(200).send({ success: true, data: news });
    } catch (err) {
        return res.status(500).send({ success: false, msg: 'Erro ao listar news.' });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const news = await News.scope('complete').findOne({
            where: {
                id: id,
            }
        });
        res.status(200).send({ success: true, data: news });
    } catch (err) {
        return res.status(500).send({ success: false, msg: 'Erro ao listar news.' });
    }
});

router.put('/:id', [
    param('id', 'Id não pode ser nulo')
        .exists()
        .isNumeric({ no_symbols: true })
        .withMessage('Id precisa ser um número'),
    check('photo')
        .optional(),
    check('description')
        .optional(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
    }
    const id = req.params.id;
    const newsUpdated = req.body;
    try {
        await models.sequelize.transaction(async (transaction) => {
            const news = await News.findByPk(id, { transaction });
            await News.update(newsUpdated, {
                where: { id: news.id }
            }, { transaction });
        });
        res.status(200).send({ success: true, msg: 'News atualizado com sucesso!' })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ success: false, msg: 'Erro ao atualizar News.' });
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const news = await News.destroy({
            where: { id: id }
        });
        res.status(200).send({ success: true, data: news });
    } catch (err) {
        return res.status(500).send({ success: false, msg: 'Erro ao apagar news.' });
    }
});

module.exports = router;