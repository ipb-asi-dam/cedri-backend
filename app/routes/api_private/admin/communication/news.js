const router = require('express').Router()
const models = require('../../../../models')
const { param, check, validationResult } = require('express-validator/check')
const { file: File } = models
const { hasPermission } = require('../../../../middleweres')
const News = models.news

router.post('/', [
  hasPermission,
  check('description', 'Atributo description não pode ser nulo')
    .exists()

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
    const newsCreated = await models.sequelize.transaction(async (transaction) => {
      if (image) {
        let file
        if (news.fileId) {
          file = await File.update(image, {
            where: { id: news.fileId },
            transaction
          })
        } else {
          file = await File.create(image, { transaction })
        }
        news.fileId = file.id
      }
      const news1 = await News.create(news, { transaction })
      return news1
    })
    return res
      .status(201)
      .jsend
      .success(await News.scope('complete').findByPk(newsCreated.id))
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao criar news' })
  }
})

router.get('/', hasPermission, async (req, res) => {
  try {
    const news = await News.scope('complete').findAll()
    res.status(200).send({ success: true, data: news })
  } catch (err) {
    return res.status(500).send({ success: false, msg: 'Erro ao listar news.' })
  }
})

router.get('/:id', hasPermission, async (req, res) => {
  const id = +req.params.id
  try {
    const news = await News.scope('complete').findByPk(id)
    if (news) {
      return res
        .status(200)
        .jsend
        .success(news)
    } else {
      return res
        .status(404)
        .jsend
        .fail({ message: 'News não encontrado' })
    }
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao listar news.' })
  }
})

router.put('/:id', [
  hasPermission,
  param('id', 'Id não pode ser nulo')
    .exists()
    .isNumeric({ no_symbols: true })
    .withMessage('Id precisa ser um número'),
  check('description')
    .optional()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() })
  }
  const id = req.params.id
  const user = req.body
  if (req.user.isAdmin !== true && user.isAdmin === true) {
    return res
      .status(401)
      .jsend
      .fail({
        message: 'Você não tem permissão realizer essa ação'
      })
  }
  const newsUpdated = req.body
  const image = (req.files || {}).image
  console.log((req.files || {}))
  console.log(JSON.stringify((req.files || {}).image))
  try {
    await models.sequelize.transaction(async (transaction) => {
      const news = await News.findByPk(id)
      if (!news) {
        return res
          .status(404)
          .jsend
          .fail({ message: 'News não encontrado.' })
      }
      if (image) {
        let file
        if (news.fileId) {
          file = await File.update(image, {
            where: { id: news.fileId },
            transaction
          })
        } else {
          file = await File.create(image, { transaction })
        }
        news.fileId = file.id
      }
      return News.update(newsUpdated, {
        where: { id: news.id },
        transaction
      })
    })
    return res
      .status(200)
      .jsend
      .success(await News.scope('complete').findByPk(id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao atualizar news.' })
  }
})

router.delete('/:id', hasPermission, async (req, res) => {
  const id = +req.params.id
  try {
    const news = await News.destroy({
      where: {
        id
      }
    })
    if (!news) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'News não existe' })
    }
    return res
      .status(200)
      .jsend
      .success({ message: 'News apagado com sucesso' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao apagar news ' + id })
  }
})

router.get('/:id/files/', hasPermission, async (req, res) => {
  const id = +req.params.id
  try {
    const news = await News.findByPk(id)
    if (!news) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'News não encontrado' })
    }
    const file = await File.findByPk(news.fileId)
    return res
      .status(200)
      .jsend
      .success(file ? [{ md5: file.md5, mimetype: file.mimetype }] : [])
  } catch (err) {
    console.log(err)
    return res.status(500).jsend.fail(err)
  }
})

router.get('/:id/files/:hash', hasPermission, async (req, res) => {
  const hash = req.params.hash
  const id = +req.params.id
  try {
    const news = await News.findByPk(id)
    if (!news) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'News não encontrado' })
    }
    const file = await File.findOne({ where: { md5: hash } })
    return res
      .status(200)
      .end(file.data, 'binary')
  } catch (err) {
    console.log(err)
    return res.status(500).jsend.fail(err)
  }
})

module.exports = router
