const router = require('express').Router()
const { patent: Patent } = require('../../../../../models')
const { pagination } = require('../../../../../middleweres')

router.get('/', pagination, async (req, res) => {
  try {
    const limit = req.query.limit
    const page = req.query.page
    const offset = limit * (page - 1)
    let patents
    if (req.user.isAdmin !== true) {
      patents = await Patent.scope('posts').findAndCountAll({
        limit,
        offset,
        where: {
          investigatorId: +req.user.id
        }
      })
    } else {
      patents = await Patent.scope('posts').findAndCountAll({
        limit,
        offset
      })
    }
    const pagesTotal = Math.ceil(patents.count / limit)
    const countTotal = patents.count
    return res
      .status(200)
      .jsend
      .success({ elements: patents.rows, pagesTotal, countTotal })
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
