const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const models = require('../../../../../../models')
const { news: News, file: File } = models

router.post('/', [
  check('title')
    .exists()
    .withMessage('Campo title não pode ser nulo')
    .toString()
    .trim(),
  check('descriptionHtml')
    .exists()
    .withMessage('Campo descriptionHtml não pode ser nulo')
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
  const news = req.body
  const image = (req.files || {}).image
  try {
    const createdNews = await models.sequelize.transaction(async (transaction) => {
      if (image) {
        const file = await File.create(image, { transaction })
        news.fileId = file.id
      }
      return News.create(news, { transaction })
    })
    return res
      .status(201)
      .jsend
      .success(await News.scope('posts').findByPk(createdNews.id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao inserir news' })
  }
})
module.exports = router
