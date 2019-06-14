const router = require('express').Router()
const models = require('../../../../models')
const { check, validationResult } = require('express-validator/check')
const Media = models.media

router.post('/', [
  check('description', 'Atributo name não pode ser nulo')
    .exists()

], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() })
  }

  try {
    const mediaCreated = await Media.create(req.body)
    res.status(201).json({ success: true, data: mediaCreated })
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Erro ao criar Media' })
  }
})

module.exports = router
