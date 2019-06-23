const router = require('express').Router()
const { patent: Patent } = require('../../../../../models')
const { hasPermissionPosts } = require('../../../../../middleweres')

router.put('/:id', async (req, res) => {
  const id = +req.params.id
  const patent = req.body
  try {
    const _patent = await Patent.findByPk(id)
    if (!_patent) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Patent com id ' + id + ' não existe' })
    }
    if (!hasPermissionPosts(req.user, _patent.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para editar esse post' })
    }
    await Patent.update(patent, {
      where: {
        id
      }
    })
    return res
      .status(200)
      .jsend
      .success(await Patent.scope('posts').findByPk(id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .error({ message: 'Erro ao editar patente de id ' + id })
  }
})

module.exports = router
