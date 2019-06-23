const router = require('express').Router()
const models = require('../../../../../models')
const Publication = models.publication
const { pagination } = require('../../../../../middleweres')

router.get('/', pagination, async (req, res) => {
  try {
    const limit = req.query.limit
    const page = req.query.page
    const offset = limit * (page - 1)
    let publications
    if (req.user.isAdmin !== true) {
      publications = await Publication.scope('posts').findAndCountAll({
        limit,
        offset,
        where: {
          investigatorId: +req.user.id
        }
      })
    } else {
      publications = await Publication.scope('posts').findAndCountAll({
        limit,
        offset
      })
    }
    const pagesTotal = Math.ceil(publications.count / limit)
    const countTotal = publications.count
    return res
      .status(200)
      .jsend
      .success({ publications: publications.rows, pagesTotal, countTotal })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todas as publicações' })
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
