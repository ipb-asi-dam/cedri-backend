const router = require('express').Router();
const models = require('../../../../models');
const { check, validationResult } = require('express-validator/check');
const News = models.news;
const {isAdmin} = require('../../../../middleweres');

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

router.get('/:id',async (req, res) => {
    const id = req.params.id;
    try {
        const news = await News.scope('basic').findOne({
            where: {
                id: id,
            }
        });
        res.status(200).send({success: true, data: news });
    }catch(err){
        return res.status(500).send({success: false, msg: 'Erro ao listar news.'});
    }
});

module.exports = router;