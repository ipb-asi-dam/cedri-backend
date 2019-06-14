const router = require('express').Router()
const models = require('../../../models')
const { Investigator } = models

router.get('/users', async (req, res, next) => {
  try {
    const investigadores = await Investigator.findAll()
    console.log(investigadores)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todas as imagens de users' })
  }
})
module.exports = router
