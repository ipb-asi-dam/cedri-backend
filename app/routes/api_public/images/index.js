const router = require('express').Router()
const models = require('../../../models')
const { file: File } = models

router.get('/', async (req, res, next) => {
  try {
    const files = await File.scope('basic').findAll()
    return res
      .status(200)
      .jsend
      .success(files)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todas as imagens de users' })
  }
})

router.get('/:id', async (req, res, next) => {
  const id = +req.params.id
  try {
    const file = await File.findOne({
      where: {
        id
      }
    })
    if (!file) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Arquivo não encontrado' })
    }
    return res
      .status(200)
      .end(file.data, 'binary')
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar imagem com id:' + id })
  }
})

module.exports = router
