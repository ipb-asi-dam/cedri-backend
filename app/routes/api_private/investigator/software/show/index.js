const router = require('express').Router()
const models = require('../../../../../models')
const { software: Software } = models
const { pagination, hasPermissionPosts } = require('../../../../../middleweres')
const getPages = require('../../../../../config/global_modules/getPosts')

router.get('/', pagination, async (req, res) => {
  try {
    const paginationResult = await getPages(req, Software)
    return res
      .status(200)
      .jsend
      .success(paginationResult)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todos os software' })
  }
})

router.get('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const software = await Software.scope('complete').findByPk(id)
    if (!software) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Software com id ' + id + ' não encontrado' })
    }
    if (!hasPermissionPosts(req.user, software.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para realizar get neste post' })
    }
    return res
      .status(200)
      .jsend
      .success(software)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar software de id ' + id })
  }
})

module.exports = router
