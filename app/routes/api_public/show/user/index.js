const router = require('express').Router()
const models = require('../../../../models')
const { investigator: Investigator } = models

router.get('/', async (req, res) => {
  try {
    let users
    const query = req.query
    if (query.showDeleted === false || query.showDeleted === 'false') {
      users = await Investigator.scope('complete').findAll()
    } else {
      users = await Investigator.scope('complete').findAll({ paranoid: false })
    }
    return res
      .status(200)
      .jsend
      .success(users)
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao listar usuários.' })
  }
})

router.get('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const user = await Investigator.scope('complete').findByPk(id)
    if (user) {
      return res
        .status(200)
        .jsend
        .success(user)
    } else {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Usuário não encontrado' })
    }
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao listar usuários.' })
  }
})

module.exports = router
