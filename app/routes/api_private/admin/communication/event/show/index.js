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
router.get('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const event = await Event.scope('complete').findByPk(id)
    if (!event) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Evento com id ' + id + ' não encontrado' })
    }
    return res
      .status(200)
      .jsend
      .success(event)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todos os eventos' })
  }
})
module.exports = router
