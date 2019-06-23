const router = require('express').Router()
const model = require('../../../../../models')
const { hasPermissionPosts, pagination } = require('../../../../../middleweres')
const { award: Award } = model

router.get('/', pagination, async (req, res) => {
  try {
    const limit = req.query.limit
    const page = req.query.page
    const offset = limit * (page - 1)
    let awards
    if (req.user.isAdmin !== true) {
      awards = await Award.scope('posts').findAndCountAll({
        limit,
        offset,
        where: {
          investigatorId: +req.user.id
        }
      })
    } else {
      awards = await Award.scope('posts').findAndCountAll({
        limit,
        offset
      })
    }
    const pagesTotal = Math.ceil(awards.count / limit)
    const countTotal = awards.count
    return res
      .status(200)
      .jsend
      .success({ elements: awards.rows, pagesTotal, countTotal })
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
    const award = await Award.findByPk(id)
    if (!award) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Prêmio de id ' + id + ' não encontrado.' })
    }
    if (!hasPermissionPosts(req.user, award.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para realizar get neste post' })
    }
    return res
      .status(200)
      .jsend
      .success(award)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar prêmios com id ' + id })
  }
})

module.exports = router
