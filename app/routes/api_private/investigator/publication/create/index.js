const router = require('express').Router()
const models = require('../../../../../models')
const { check, validationResult } = require('express-validator/check')
const Publication = models.publication

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
    .isISO8601()
    .withMessage('Formato date errado. Valor esperado YYYY'),
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
    .toString()
    .matches('^b$|^bc$|^j$|^p$|^e$')
    .withMessage('parâmetro type precisa ser (j ou b ou bc ou p ou e)')
], async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  const pub = req.body

  try {
    const publication = await Publication.create(pub)
    return res
      .status(201)
      .jsend
      .success(await Publication.scope('posts').findByPk(publication.id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Algo deu errado durante a criação da publicação' })
  }
})

module.exports = router
