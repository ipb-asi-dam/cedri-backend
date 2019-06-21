const router = require('express').Router()
const models = require('../../../../models')
const { param, check, validationResult } = require('express-validator/check')
const Event = models.event

router.post('/', [
  check('date', 'Atributo date não pode ser nulo')
    .exists(),
  // .isDateURI().withMessage('Atributo date não é uma data'),
  check('local', 'Atributo local não pode ser nulo')
    .exists()

], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() })
  }

  try {
    const eventCreated = await Event.create(req.body)
    res.status(201).json({ success: true, data: eventCreated })
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Erro ao criar Event' })
  }
})

router.get('/', async (req, res) => {
  try {
    const event = await Event.scope('complete').findAll()
        res.status(200).send({ success: true, data: event })
    } catch (err) {
    return res.status(500).send({ success: false, msg: 'Erro ao listar event.' })
    }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
    try {
    const event = await Event.scope('complete').findOne({
      where: {
        id: id
      }
    })
        res.status(200).send({ success: true, data: event })
    } catch (err) {
    return res.status(500).send({ success: false, msg: 'Erro ao listar Event.' })
    }
})

router.put('/:id', [
  param('id', 'Id não pode ser nulo')
    .exists()
    .isNumeric({ no_symbols: true })
    .withMessage('Id precisa ser um número'),
  check('date')
    .optional(),
  check('local')
    .optional(),
  check('communicationId')
    .optional()
], async (req, res) => {
  const errors = validationResult(req)
    if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() })
    }
  const id = req.params.id
    const eventUpdated = req.body
    try {
    await models.sequelize.transaction(async (transaction) => {
      const event = await Event.findByPk(id, { transaction })
            await Event.update(eventUpdated, {
        where: { id: event.id }
      }, { transaction })
        })
        res.status(200).send({ success: true, msg: 'Event atualizado com sucesso!' })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ success: false, msg: 'Erro ao atualizar Event.' })
    }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
    try {
    const event = await Event.destroy({
      where: { id: id }
    })
        res.status(200).send({ success: true, data: event })
    } catch (err) {
    return res.status(500).send({ success: false, msg: 'Erro ao apagar event.' })
    }
})

module.exports = router
