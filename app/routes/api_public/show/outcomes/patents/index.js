const router = require('express').Router()
const getPublicPosts = require('../../../../../config/global_modules/getPublicPosts')
const models = require('../../../../../models')
const { pagination } = require('../../../../../middleweres')

router.get('/', pagination, async (req, res) => {
  try {
    const elements = await getPublicPosts(req, models.patent)
    return res
      .status(200)
      .jsend
      .success(elements)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao listar todas as patentes' })
  }
})
module.exports = router
