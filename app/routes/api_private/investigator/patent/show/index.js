const router = require('express').Router()
const { patent: Patent } = require('../../../../../models')
const { pagination, hasPermissionPosts } = require('../../../../../middleweres')
const getPages = require('../../../../../config/global_modules/getPosts')

router.get('/', pagination, async (req, res) => {
  try {
    const paginationResult = await getPages(req, Patent)
    return res
      .status(200)
      .jsend
      .success(paginationResult)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todas as patentes' })
  }
})

router.get('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const patent = await Patent.scope('complete').findByPk(id)
    if (!patent) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Patent com id ' + id + ' não encontrada' })
    }
    if (!hasPermissionPosts(req.user, patent.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para realizar get neste post' })
    }
    return res
      .status(200)
      .jsend
      .success(patent)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar patente de id ' + id })
  }
})

module.exports = router
