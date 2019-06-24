const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const models = require('../../../../../../models')
const { event: Event } = models

router.post('/:id', [
  check('startDate')
    .optional()
    .isISO8601()
    .withMessage('Data inválida, insira (YYYY-MM-DD ou YYYY-MM ou YYYY)'),
  check('endDate')
    .optional()
    .isISO8601()
    .withMessage('Data inválida, insira (YYYY-MM-DD ou YYYY-MM ou YYYY)')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  const event = req.body
  const id = +req.params.id
  try {
    const evento = await Event.findByPk(id)
    if (!evento) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Evento de id ' + id + ' não encontrado.' })
    }
    await Event.update(event, {
      where: {
        id
      }
    })
    return res
      .status(200)
      .jsend
      .success(await Event.scope('posts').findByPk(id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao editar evento' })
  }
})
module.exports = router
