const router = require('express').Router()
const models = require('../../../../../models')
const { investigator: Investigator } = models
const { isAdmin } = require('../../../../../middleweres')

router.delete('/:id', isAdmin, async (req, res) => {
  const id = +req.params.id
  try {
    const investigator = await Investigator.destroy({
      where: {
        id
      }
    })
    if (!investigator) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Usuário não existe' })
    }
    return res
      .status(200)
      .jsend
      .success({ message: 'Usuário deletado com sucesso' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao deletar usuário ' + id })
  }
})

module.exports = router
