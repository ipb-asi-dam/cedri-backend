const router = require('express').Router()
const { news: News } = require('../../../../../../models')

router.delete('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const news = await News.findByPk(id)
    if (!news) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'News com id ' + id + ' não encontrada' })
    }
    news.destroy()
    return res
      .status(200)
      .jsend
      .success({ message: 'News deletada com sucesso!' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao deletar news com id ' + id })
  }
})
module.exports = router
