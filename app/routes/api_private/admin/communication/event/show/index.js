const router = require('express').Router()
const { pagination } = require('../../../../../../middleweres')
const { event: Event } = require('../../../../../../models')
const getPages = require('../../../../../../config/global_modules/getPosts')

router.get('/', pagination, async (req, res) => {
  try {
    const paginationResult = await getPages(req, Event)
    return res
      .status(200)
      .jsend
      .success(paginationResult)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todos os eventos' })
  }
})
module.exports = router
