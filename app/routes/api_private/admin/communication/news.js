const router = require('express').Router()
const models = require('../../../../models')
const { param, check, validationResult } = require('express-validator/check')
const { hasPermission } = require('../../../../middleweres')
const News = models.news

router.post('/', [
  hasPermission,
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
  try {
    await models.sequelize.transaction(async (transaction) => {
      const news = await News.findByPk(id, { transaction })
      await News.update(newsUpdated, {
        where: { id: news.id }
      }, { transaction })
    })
    res.status(200).send({ success: true, msg: 'News atualizado com sucesso!' })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ success: false, msg: 'Erro ao atualizar News.' })
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
        .fail({ message: 'Usuário não encontrado' })
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
        .fail({ message: 'Usuário não encontrado' })
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
