const router = require('express').Router()
const { patent: Patent } = require('../../../../../models')
const { pagination } = require('../../../../../middleweres')
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
      .error({ message: 'Erro ao retornar todos os prêmios' })
  }
})

router.get('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const patent = await Patent.findOne({
      where: {
        id
      }
    })
    if (!patent) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Patent com id ' + id + ' não encontrada' })
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
