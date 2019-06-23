const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const models = require('../../../../../models')
const { software: Software, file: File } = models

router.post('/', [
  check('title')
    .exists()
    .withMessage('Campo title não pode ser nulo')
    .toString()
    .trim(),
  check('description')
    .exists()
    .withMessage('Campo description não pode ser nulo')
    .toString()
    .trim()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  const software = req.body
  const image = (req.files || {}).image
  try {
    const softwareCreated = await models.sequelize.transaction(async (transaction) => {
      if (image) {
        const file = await File.create(image, { transaction })
        software.fileId = file.id
      }
      return Software.create(software, { transaction })
    })
    return res
      .status(201)
      .jsend
      .success(await Software.scope('posts').findByPk(softwareCreated.id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao inserir Software' })
  }
})

module.exports = router
