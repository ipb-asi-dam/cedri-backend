const router = require('express').Router()
const { pagination } = require('../../../../../../middleweres')
const { media: Media } = require('../../../../../../models')
const getPages = require('../../../../../../config/global_modules/getPosts')

router.get('/', pagination, async (req, res) => {
  try {
    const paginationResult = await getPages(req, Media)
    return res
      .status(200)
      .jsend
      .success(paginationResult)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todas as Medias' })
  }
})

router.get('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const media = await Media.scope('complete').findByPk(id)
    if (!media) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Media com id ' + id + ' não encontrada' })
    }
    return res
      .status(200)
      .jsend
      .success(media)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todas as Medias' })
  }
})
module.exports = router
