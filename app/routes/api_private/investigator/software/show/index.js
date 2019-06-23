const router = require('express').Router()
const models = require('../../../../../models')
const { software: Software } = models
const { pagination } = require('../../../../../middleweres')

router.get('/', pagination, async (req, res) => {
  try {
    const limit = req.query.limit
    const page = req.query.page
    const offset = limit * (page - 1)
    let software
    if (req.user.isAdmin !== true) {
      software = await Software.scope('posts').findAndCountAll({
        limit,
        offset,
        where: {
          investigatorId: +req.user.id
        }
      })
    } else {
      software = await Software.scope('posts').findAndCountAll({
        limit,
        offset
      })
    }
    const pagesTotal = Math.ceil(software.count / limit)
    const countTotal = software.count
    return res
      .status(200)
      .jsend
      .success({ software: software.rows, pagesTotal, countTotal })
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
    const software = await Software.findOne({
      where: {
        id
      }
    })
    if (!software) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Software com id ' + id + ' não encontrado' })
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
      .error({ message: 'Erro ao retornar todos software' })
  }
})

module.exports = router
