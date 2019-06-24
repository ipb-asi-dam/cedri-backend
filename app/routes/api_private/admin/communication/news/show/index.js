const router = require('express').Router()
const { pagination } = require('../../../../../../middleweres')
const { news: News } = require('../../../../../../models')
const getPages = require('../../../../../../config/global_modules/getPosts')
router.get('/', pagination, async (req, res) => {
  try {
    const paginationResult = await getPages(req, News)
    return res
      .status(200)
      .jsend
      .success(paginationResult)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todas as News' })
  }
})
module.exports = router
