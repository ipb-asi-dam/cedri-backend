const router = require('express').Router()
const getPublicPosts = require('../../../../../config/global_modules/getPublicPosts')
const models = require('../../../../../models')

router.get('/', async (req, res) => {
  try {
    const elements = await getPublicPosts(req, models.software)
    return res
      .status(200)
      .jsend
      .success(elements)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao listar todos os software' })
  }
})
module.exports = router
