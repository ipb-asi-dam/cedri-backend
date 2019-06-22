const router = require('express').Router()
const models = require('../../../../models')
const { param, check, validationResult } = require('express-validator/check')
const Publication = models.publication
const { hasPermission } = require('../../../../middleweres')

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
    .optional()
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
    .withMessage('parâmetro type precisa ser (j ou b ou bc ou j ou p ou e)')
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
    return res
      .status(500)
      .jsend
      .error({ message: 'Algo deu errado durante a criação da publicação' })
  }
})

router.get('/', async (req, res, next) => {
  try {
    const publications = await Publication.scope('complete').findAll()
    return res
      .status(200)
      .jsend
      .success(publications)
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({ message: 'Algo deu errado durante a listagem das publicações' })
  }
})

router.get('/types/:type', [
  param('type')
    .matches('^b$|^bc$|^j$|^p$|^e$')
    .withMessage('parâmetro type precisa ser (j ou b ou bc ou j ou p ou e)')
], async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  try {
    const publications = await Publication.scope('complete').findAll({
      where: {
        type: req.params.type
      }
    })
    return res
      .status(200)
      .jsend
      .success(publications)
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({
        message: 'Algo deu errado durante a listagem das publicações do tipo ' + req.params.type
      })
  }
})

router.put('/:id', [
  hasPermission,
  check('year')
    .optional()
    .isISO8601()
    .withMessage('Formato date errado. Valor esperado YYYY'),
  check('type')
    .optional()
    .toString()
    .matches('^b$|^bc$|^j$|^p$|^e$')
    .withMessage('parâmetro type precisa ser (j ou b ou bc ou j ou p ou e)')
], async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  try {
    const publication = await Publication.findByPk(req.params.id)
    if (!publication) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Publication não encontrada!' })
    }
    await Publication.update(req.body,
      {
        where: {
          id: publication.id
        }
      })

    return res
      .status(200)
      .jsend
      .success(await Publication.scope('complete').findByPk(publication.id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Algo deu errado durante o update da publicação' })
  }
})

module.exports = router
