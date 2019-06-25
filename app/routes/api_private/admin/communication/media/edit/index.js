const router = require('express').Router()
const models = require('../../../../../../models')
const { media: Media, file: File } = models

router.put('/:id', async (req, res) => {
  const media = req.body
  const id = +req.params.id
  const extraFile = (req.files || {}).extraFile
  try {
    await models.sequelize.transaction(async (transaction) => {
      const _media = await Media.findByPk(id)
      if (!_media) {
        return res
          .status(404)
          .jsend
          .fail({ message: 'Media de id ' + id + ' não encontrada' })
      }
      if (extraFile) {
        if (_media.fileId) {
          await File.update(extraFile, {
            where: {
              id: _media.fileId
            },
            transaction
          })
        } else {
          const file = await File.create(extraFile, { transaction })
          media.fileId = file.id
        }
      }

      return Media.update(media, {
        transaction,
        where: {
          id
        }
      })
    })
    return res
      .status(200)
      .jsend
      .success(await Media.scope('posts').findByPk(id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao inserir media' })
  }
})
module.exports = router
