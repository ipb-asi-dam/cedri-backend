const router = require('express').Router()
const model = require('../../../../../models')
const { hasPermissionPosts, pagination } = require('../../../../../middleweres')
const { award: Award } = model
const getPages = require('../../../../../config/global_modules/getPosts')

router.get('/', pagination, async (req, res) => {
  try {
    const paginationResult = await getPages(req, Award)
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
