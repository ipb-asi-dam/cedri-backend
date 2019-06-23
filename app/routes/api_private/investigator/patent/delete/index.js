const router = require('express').Router()
const { hasPermissionPosts } = require('../../../../../middleweres')
const { patent: Patent } = require('../../../../../models')

router.delete('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const _patent = await Patent.findByPk(id)
    if (!_patent) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Patente com id ' + id + ' não encontrada' })
    }
    if (!hasPermissionPosts(req.user, _patent.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para deletar esse post' })
    }
    await Patent.destroy({
      where: {
        id
      }
    })
    return res
      .status(200)
      .jsend
      .success({ message: 'Patente deletada com sucesso!' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao deletar patente com id ' + id })
  }
})
module.exports = router
