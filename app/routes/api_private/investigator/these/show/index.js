const router = require('express').Router()
const { these: These } = require('../../../../../models')
const { hasPermissionPosts, pagination } = require('../../../../../middleweres')
const getPages = require('../../../../../config/global_modules/getPosts')

router.get('/', pagination, async (req, res) => {
  try {
    const paginationResult = await getPages(req, These)
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
    const _these = await These.findByPk(id)
    if (!_these) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'These com id ' + id + 'não encontrada' })
    }
    if (!hasPermissionPosts(req.user, _these.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para listar esse post de id ' + id })
    }
    return res
      .status(200)
      .jsend
      .success(_these)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar these com id ' + id })
  }
})

module.exports = router
