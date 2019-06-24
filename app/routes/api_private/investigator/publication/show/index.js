const router = require('express').Router()
const models = require('../../../../../models')
const Publication = models.publication
const { pagination } = require('../../../../../middleweres')
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
      .error({ message: 'Erro ao retornar todos os prêmios' })
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
