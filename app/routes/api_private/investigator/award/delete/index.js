const router = require('express').Router()
const model = require('../../../../../models')
const { hasPermissionPosts } = require('../../../../../middleweres')
const { award: Award } = model

router.delete('/:id', async (req, res) => {
  const id = +req.params.id

  try {
    const _award = await Award.findByPk(id)
    if (!_award) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Prêmio com id ' + id + ' não encontrado' })
    }
    if (!hasPermissionPosts(req.user, _award.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para editar esse post' })
    }
    await Award.destroy({
      where: {
        id
      }
    })
    return res
      .status(200)
      .jsend
      .success({ message: 'Prêmio deletado com sucesso!' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao deletar prêmio com id ' + id })
  }
})

module.exports = router
