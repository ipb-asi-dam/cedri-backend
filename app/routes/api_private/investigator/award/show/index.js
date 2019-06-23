const router = require('express').Router()
const model = require('../../../../../models')
const { hasPermissionPosts, pagination } = require('../../../../../middleweres')
const { award: Award } = model

router.get('/', pagination, async (req, res) => {
  try {
    const countTotal = (await Award.findAndCountAll()).count
    const limit = req.query.limit > countTotal ? countTotal : req.query.limit
    const pagesTotal = Math.ceil(countTotal / limit)
    const page = req.query.page > pagesTotal ? pagesTotal : req.query.page
    let offset = limit * (page - 1)
    let awards
    if (req.user.isAdmin !== true) {
      awards = await Award.scope('posts').findAll({
        limit,
        offset,
        where: {
          investigatorId: +req.user.id
        }
      })
    } else {
      awards = await Award.scope('posts').findAll({
        limit,
        offset
      })
    }
    return res
      .status(200)
      .jsend
      .success({ awards, pagesTotal, countTotal })
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
        .fail({ message: 'Sem permissão para editar esse post' })
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
      .error({ message: 'Erro ao retornar todos os prêmios' })
  }
})

module.exports = router
