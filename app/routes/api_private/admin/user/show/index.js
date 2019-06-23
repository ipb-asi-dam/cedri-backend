const router = require('express').Router()
const models = require('../../../../../models')
const { investigator: Investigator, file: File } = models
const { isAdmin, hasPermission } = require('../../../../../middleweres')

router.get('/', isAdmin, async (req, res) => {
  try {
    let users
    const query = req.query
    if (query.showDeleted === false || query.showDeleted === 'false') {
      users = await Investigator.scope('complete').findAll()
    } else {
      users = await Investigator.scope('complete').findAll({ paranoid: false })
    }
    return res
      .status(200)
      .jsend
      .success(users)
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao listar usuários.' })
  }
})

router.get('/:id', hasPermission, async (req, res) => {
  const id = +req.params.id
  try {
    const user = await Investigator.scope('complete').findByPk(id)
    if (user) {
      return res
        .status(200)
        .jsend
        .success(user)
    } else {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Usuário não encontrado' })
    }
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao listar usuários.' })
  }
})

router.get('/:id/files/', hasPermission, async (req, res) => {
  const id = +req.params.id
  try {
    const investigador = await Investigator.findByPk(id)
    if (!investigador) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Usuário não encontrado' })
    }
    const file = await File.findByPk(investigador.fileId)
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
    const investigador = await Investigator.findByPk(id)
    if (!investigador) {
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
