const router = require('express').Router();
const models = require('../../../../models');
const { param, check, validationResult } = require('express-validator/check');
const Publication = models.publication,
    Book = models.book;

router.post('/', [
    check('authors')
        .exists()
        .withMessage('authors não pode ser nulo')
        .toString(),
    check('title')
        .exists()
        .withMessage('title não pode ser nulo')
        .toString(),
    check('year')
        .exists()
        .withMessage('year não pode ser nulo')
        .isNumeric()
        .withMessage('Campo year precisa ser um número')
        .isLength({min: 4, max: 4})
        .withMessage('year precisa ter 4 digitos')
        .toInt(),
    check('sourceTitle')
        .exists()
        .withMessage('sourceTitle não pode ser nulo')
        .toString(),    
    check('url')
        .exists()
        .withMessage('url não pode ser nulo')
        .toString(),
    check('type')
        .exists()
        .withMessage('type não pode ser nulo')
        .toString(),
], async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ success: false, errors: errors.array() });
    }
    const pub = req.body;

    try {
        const publication = await Publication.create(pub);
        return res
            .status(201)
            .send({
                success: true,
                data: await Publication.scope('complete').findByPk(publication.id)
            });
    } catch(err){ 
        return res
            .status(500)
            .send({
                success: false,
                msg: 'Algo deu errado durante a criação da publicação'
            })
    }
});

router.get('/', async (req, res, next) => {
    try {
        const publications = await Publication.scope('complete').findAll();
        return res
            .status(200)
            .send({
                success: true,
                data: publications
            });
    } catch(err){ 
        return res
            .status(500)
            .send({
                success: false,
                msg: 'Algo deu errado durante a listagem das publicações'
            })
    }
});

router.get('/types/:type', [
    param('type')
        .matches('^b$|^bc$|^j$|^p$|^e$')
        .withMessage('parâmetro type precisa ser (j ou b ou bc ou j ou p ou e)')
],async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ success: false, errors: errors.array() });
    }
    try {
        const publications = await Publication.scope('complete').findAll({ 
            where: {
                type: req.params.type
            }
        });
        return res
            .status(200)
            .send({
                success: true,
                data: publications
            });
    } catch(err){ 
        return res
            .status(500)
            .send({
                success: false,
                msg: 'Algo deu errado durante a listagem das publicações do tipo '+ req.params.type
            })
    }
});

router.put('/:id', [
    check('year')
        .optional()
        .isNumeric()
        .withMessage('Campo year precisa ser um número')
        .isLength({min: 4, max: 4})
        .withMessage('year precisa ter 4 digitos')
        .toInt(),
], async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ success: false, errors: errors.array() });
    }
    try{
        const publication = await Publication.findByPk(req.param.id)
        await Publication.update(req.body,
            {
                where: {
                    id: publication.id
                }
            });
        return res
            .status(200)
            .send({
                success: true,
                msg: 'Usuário atualizado com sucesso!'
            });
    } catch (err){
        return res
            .status(500)
            .send({
                success: false,
                msg: 'Algo deu errado durante o update da publicação'
            })
    }
});

module.exports = router;