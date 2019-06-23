const router = require('express').Router()
const { these: These } = require('../../../../../models')
const { hasPermissionPosts } = require('../../../../../middleweres')

router.put('/:id', async (req, res) => {
  const id = +req.params.id
  const these = req.body
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
        .fail({ message: 'Sem permissão para editar esse post' })
    }
    await These.update(these, {
      where: {
        id
      }
    })
    return res
      .status(200)
      .jsend
      .success(await These.scope('posts').findByPk(id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao editar these com id ' + id })
  }
})

module.exports = router
