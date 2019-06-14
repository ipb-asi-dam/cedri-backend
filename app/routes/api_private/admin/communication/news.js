const router = require('express').Router()
const models = require('../../../../models')
const { check, validationResult } = require('express-validator/check')
const News = models.news

router.post('/', [
  check('photo', 'Atributo photo não pode ser nulo')
    .exists(),
  check('description', 'Atributo description não pode ser nulo')
    .exists()

], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() })
  }

  try {
    const newsCreated = await News.create(req.body)
    res.status(201).json({ success: true, data: newsCreated })
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Erro ao criar News' })
  }
})

module.exports = router
