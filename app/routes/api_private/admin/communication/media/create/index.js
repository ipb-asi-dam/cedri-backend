const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const models = require('../../../../../../models')
const { media: Media, file: File } = models
router.post('/', [
  check('title')
    .exists()
    .withMessage('Campo title não pode ser nulo')
    .toString(),
  check('descriptionHtml')
    .exists()
    .withMessage('Campo descriptionHtml não pode ser nulo')
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
  const extraFile = (req.files || {}).extraFile
  try {
    const mediaCreated = await models.sequelize.transaction(async (transaction) => {
      if (extraFile) {
        const file = await File.create(extraFile, { transaction })
        media.fileId = file.id
      }
      return Media.create(media, { transaction })
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
