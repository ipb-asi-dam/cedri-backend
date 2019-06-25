const router = require('express').Router()
const getPublicPosts = require('../../../../../config/global_modules/getPublicPosts')
const models = require('../../../../../models')

router.get('/', async (req, res) => {
  try {
    const elements = await getPublicPosts(req, models.media)
    return res
      .status(200)
      .jsend
      .success(elements)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao listar todas as medias' })
  }
})
module.exports = router
