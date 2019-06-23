const router = require('express').Router()
const { hasPermissionPosts } = require('../../../../../middleweres')
const { publication: Publication } = require('../../../../../models')

router.delete('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const _publication = await Publication.findByPk(id)
    if (!_publication) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Publicação com id ' + id + ' não encontrada' })
    }
    if (!hasPermissionPosts(req.user, _publication.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para deletar esse post' })
    }
    await Publication.destroy({
      where: {
        id
      }
    })
    return res
      .status(200)
      .jsend
      .success({ message: 'Publicação deletada com sucesso!' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao deletar publicação com id ' + id })
  }
})
module.exports = router
