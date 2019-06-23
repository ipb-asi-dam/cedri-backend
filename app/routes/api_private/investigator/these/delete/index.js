const router = require('express').Router()
const { these: These } = require('../../../../../models')
const { hasPermissionPosts } = require('../../../../../middleweres')

router.delete('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const these = await These.findByPk(id)
    if (!these) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Tese com id ' + id + ' não encontrada' })
    }
    if (!hasPermissionPosts(req.user, these.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para deletar esse post' })
    }
    await These.destroy({
      where: {
        id
      }
    })
    return res
      .status(200)
      .jsend
      .success({ message: 'Tese deletada com sucesso!' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao deletar tese com id ' + id })
  }
})

module.exports = router
