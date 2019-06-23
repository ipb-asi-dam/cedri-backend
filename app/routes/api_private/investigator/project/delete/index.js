const router = require('express').Router()
const { hasPermissionPosts } = require('../../../../../middleweres')
const { project: Project } = require('../../../../../models')

router.delete('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const _project = await Project.findByPk(id)
    if (!_project) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Projeto com id ' + id + ' não encontrado' })
    }
    if (!hasPermissionPosts(req.user, _project.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para deletar esse post' })
    }
    await Project.destroy({
      where: {
        id
      }
    })
    return res
      .status(200)
      .jsend
      .success({ message: 'Projeto deletado com sucesso!' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao deletar projeto com id ' + id })
  }
})
module.exports = router
