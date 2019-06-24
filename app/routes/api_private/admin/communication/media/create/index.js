const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const models = require('../../../../../../models')
const { media: Media, file: File } = models
router.post('/', [
  check('title')
    .exists()
    .withMessage('Campo title não pode ser nulo')
    .toString()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  const media = req.body
  const image = (req.files || {}).image
  const extraFile = (req.files || {}).extraFile
  try {
    const mediaCreated = await models.sequelize.transaction(async (transaction) => {
      const mediaCreated = await Media.create(media, { transaction })
      if (image) {
        const file = await File.create(image, { transaction })
        await mediaCreated.addFiles(file, { transaction })
      }
      if (extraFile) {
        const file = await File.create(extraFile, { transaction })
        await mediaCreated.addFiles(file, { transaction })
      }

      return mediaCreated
    })
    return res
      .status(200)
      .jsend
      .success(await Media.scope('posts').findByPk(mediaCreated.id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao inserir media' })
  }
})
module.exports = router
