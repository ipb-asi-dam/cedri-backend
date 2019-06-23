const router = require('express').Router()
const models = require('../../../../../models')
const { software: Software } = models
const { hasPermissionPosts } = require('../../../../../middleweres')

router.delete('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const software = await Software.findByPk(id)
    if (!software) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Software com id ' + id + ' não encontrado' })
    }
    if (!hasPermissionPosts(req.user, software.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para deletar esse post' })
    }
    await Software.destroy({
      where: {
        id
      }
    })
    return res
      .status(200)
      .jsend
      .success({ message: 'Software deletado com sucesso!' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao deletar Software com id ' + id })
  }
})
module.exports = router
