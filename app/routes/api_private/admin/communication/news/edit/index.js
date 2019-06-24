const router = require('express').Router()
const models = require('../../../../../../models')
const { file: File, news: News } = models

router.put('/:id', async (req, res) => {
  const id = +req.params.id
  const image = (req.files || {}).image
  const news = req.body
  try {
    const _news = await News.findByPk(id)
    if (!_news) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'News com id ' + id + ' não encontrada' })
    }
    await models.sequelize.transaction(async (transaction) => {
      if (image) {
        if (_news.fileId) {
          await File.update(image, {
            where: {
              id: _news.fileId
            },
            transaction
          })
        } else {
          const file = await File.create(image, { transaction })
          news.fileId = file.id
        }
      }
      return News.update(news, {
        where: {
          id
        },
        transaction
      })
    })
    return res
      .status(200)
      .jsend
      .success(await News.scope('posts').findByPk(id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao editar news com id ' + id })
  }
})
module.exports = router
