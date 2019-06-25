const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const models = require('../../../../../../models')
const { event: Event } = models

router.post('/', [
  check('title')
    .exists()
    .withMessage('Campo title não pode ser nulo')
    .toString(),
  check('startDate')
    .exists()
    .withMessage('Campo startDate não pode ser nulo')
    .isISO8601()
    .withMessage('Data inválida, insira (YYYY-MM-DD ou YYYY-MM ou YYYY)'),
  check('endDate')
    .exists()
    .withMessage('Campo endDate não pode ser nulo')
    .isISO8601()
    .withMessage('Data inválida, insira (YYYY-MM-DD ou YYYY-MM ou YYYY)'),
  check('address')
    .exists()
    .withMessage('Campo address não pode ser nulo')
    .toString(),
  check('linksHtml')
    .exists()
    .withMessage('Campo links não pode ser nulo')
    .toString()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  const event = req.body
  try {
    const evento = await Event.create(event)
    return res
      .status(201)
      .jsend
      .success(await Event.scope('posts').findByPk(evento.id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao criar evento' })
  }
})
module.exports = router
