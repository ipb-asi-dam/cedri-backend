const router = require('express').Router()
const models = require('../../../../models')
const { param, check, validationResult } = require('express-validator/check')
const Communication = models.communication
const { hasPermission } = require('../../../../middleweres')

router.post('/', [
  hasPermission,
  check('name', 'Atributo name não pode ser nulo')
    .exists()
    .toString(),
  check('url')
    .exists()
    .toString(),
  check('type')
    .exists()
    .toString()
    .matches('^news$|^event$|^media$')
    .withMessage('parâmetro type precisa ser (news ou event ou media)')
], async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  const comm = req.body

  try {
    const communication = await Communication.create(comm)
    return res
      .status(201)
      .jsend
      .success(communication)
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({ message: 'Algo deu errado durante a criação da Communications' })
  }
})

router.get('/', async (req, res, next) => {
  try {
    const communications = await Communication.scope('complete').findAll()
    return res
      .status(200)
      .jsend
      .success(communications)
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({ message: 'Algo deu errado durante a listagem das Communications' })
  }
})

router.get('/types/:type', [
  param('type')
    .matches('^news$|^event$|^media$')
    .withMessage('parâmetro type precisa ser (news ou event ou media)')
], async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  try {
    const communications = await Communication.scope('complete').findAll({
      where: {
        type: req.params.type
      }
    })
    return res
      .status(200)
      .jsend
      .success(communications)
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({
        message: 'Algo deu errado durante a listagem das Communications do tipo ' + req.params.type
      })
  }
})

router.put('/:id', [
  hasPermission,
  check('name')
    .optional(),
  check('url')
    .optional(),
  check('context')
    .optional(),
  check('date')
    .optional()
    .isISO8601()
    .withMessage('Formato date errado. Valor esperado (YYYY ou YYYY-MM ou YYYY-MM-DD'),
  check('local')
    .optional(),
  check('type')
    .optional()
    .toString()
    .matches('^news$|^event$|^media$')
    .withMessage('parâmetro type precisa ser (news ou event ou media)')
], async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  try {
    const communication = await Communication.findByPk(req.params.id)
    if (!communication) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Communication não encontrada!' })
    }
    await Communication.update(req.body,
      {
        where: {
          id: communication.id
        }
      })

    return res
      .status(200)
      .jsend
      .success(await Communication.scope('complete').findByPk(communication.id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Algo deu errado durante o update da Communication' })
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const communication = await Communication.destroy({
      where: { id: id }
    })
    res.status(200).send({ success: true, data: communication })
  } catch (err) {
    return res.status(500).send({ success: false, msg: 'Erro ao apagar Communication.' })
  }
})

module.exports = router
