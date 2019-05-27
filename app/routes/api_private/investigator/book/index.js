const router = require('express').Router();
const models = require('../../../../models');
const { param, check, validationResult } = require('express-validator/check');
const Publication = models.publication,
    Book = models.book;

router.post('/', [
    check('startDate')
        .exists()
        .withMessage('starDate não pode ser nulo')
        .toDate(),
    check('endDate')
        .exists()
        .withMessage('endDate não pode ser nulo')
        .toDate(),
    check('autors')
        .exists()
        .withMessage('autors não pode ser nulo')
        .toString(),
    check('publisher')
        .exists()
        .withMessage('publisher não pode ser nulo')
        .toString(),
    check('title')
        .exists()
        .withMessage('title não pode ser nulo')
        .toString(),
    check('link')
        .optional()
        .toString(),
    check('month')
        .optional()
        .toInt()
        .isInt({min: 1, max: 12, allow_leading_zeroes: true})
        .withMessage('month precisa estar entre 1 e 12'),
    check('year')
        .optional()
        .toInt()
        .isInt({min: 2000, max: 9999})
        .withMessage('year precisa ser maior que 2000 e menor que 9999'),
], async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ success: false, errors: errors.array() });
    }
    const book = req.body;

    try {
        const bookCreated = await models.sequelize.transaction( async (transaction) => {
            const publication = await Publication.create(book, {transaction});
            book.publicationId = publication.id;
            return Book.create(book, {transaction});
        }); 
        return res
            .status(201)
            .send({
                success: true,
                data: await Book.scope('complete').findByPk(bookCreated.id)
            })
    } catch(err){ 
        return res
            .status(500)
            .send({
                success: false,
                msg: 'Algo deu errado durante a criação da publicação "book"'
            })
    }
});
module.exports = router;