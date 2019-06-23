const router = require('express').Router()
const models = require('../../../../../models')
const { software: Software, file: File } = models
const { hasPermissionPosts } = require('../../../../../middleweres')

router.put('/:id', async (req, res) => {
  const id = +req.params.id
  const software = req.body
  const image = (req.files || {}).image
  try {
    const _software = await Software.findByPk(id)
    if (!_software) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Software com id ' + id + ' não encontrado' })
    }
    if (!hasPermissionPosts(req.user, software.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para editar esse post' })
    }
    await models.sequelize.transaction(async (transaction) => {
      if (image) {
        if (_software.fileId) {
          await File.update(image, {
            transaction,
            where: {
              id: _software.fileId
            }
          })
        } else {
          const file = await File.create(image, { transaction })
          software.fileId = file.id
        }
      }
      return Software.update(software, {
        transaction,
        where: {
          id
        }
      })
    })
    return res
      .status(200)
      .jsend
      .success(await Software.scope('posts').findByPk(id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .error({ message: 'Erro ao editar Software' })
  }
})

module.exports = router
