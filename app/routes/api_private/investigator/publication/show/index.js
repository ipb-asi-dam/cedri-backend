const router = require('express').Router()
const models = require('../../../../../models')
const Publication = models.publication
const { pagination, hasPermissionPosts } = require('../../../../../middleweres')
const getPages = require('../../../../../config/global_modules/getPosts')

router.get('/', pagination, async (req, res) => {
  try {
    const paginationResult = await getPages(req, Publication)
    return res
      .status(200)
      .jsend
      .success(paginationResult)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todas as publicações' })
  }
})

router.get('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const publication = await Publication.findByPk(id)
    if (!publication) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Publication com id ' + id + ' não encontrada' })
    }
    if (!hasPermissionPosts(req.user, publication.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para realizar get neste post' })
    }
    return res
      .status(200)
      .jsend
      .success(publication)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar publication de id ' + id })
  }
})

router.get('/types/:type', async (req, res, next) => {
  try {
    const publications = await Publication.scope('complete').findAll({
      where: {
        type: req.params.type
      }
    })
    return res
      .status(200)
      .jsend
      .success(publications)
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({
        message: 'Algo deu errado durante a listagem das publicações do tipo ' + req.params.type
      })
  }
})

module.exports = router
