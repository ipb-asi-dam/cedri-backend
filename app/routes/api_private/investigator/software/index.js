const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const models = require('../../../../models')
const { software: Software, file: File } = models
const { hasPermission } = require('../../../../middleweres')

router.post('/', [
  check('title')
    .exists()
    .withMessage('Campo title não pode ser nulo')
    .toString()
    .trim(),
  check('description')
    .exists()
    .withMessage('Campo description não pode ser nulo')
    .toString()
    .trim()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  const software = req.body
  const image = (req.files || {}).image
  try {
    const softwareCreated = await models.sequelize.transaction(async (transaction) => {
      if (image) {
        const file = await File.create(image, { transaction })
        software.fileId = file.id
      }
      return Software.create(software, { transaction })
    })
    return res
      .status(201)
      .jsend
      .success(softwareCreated)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao inserir Software' })
  }
})

router.put('/:id', hasPermission, async (req, res) => {
  const id = +req.params.id
  const software = req.body
  try {
    const _software = await Software.findByPk(id)
    if (!_software) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Software com id ' + id + ' não encontrado' })
    }
    await Software.update(software, {
      where: {
        id
      }
    })
    return res
      .status(200)
      .jsend
      .success(await Software.findByPk(id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .error({ message: 'Erro ao inserir Software' })
  }
})

router.get('/', async (req, res) => {
  try {
    const software = await Software.findAll()
    return res
      .status(200)
      .jsend
      .success(software)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todos software' })
  }
})
router.get('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const software = await Software.findOne({
      where: {
        id
      }
    })
    if (!software) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Software com id ' + id + ' não encontrado' })
    }
    return res
      .status(200)
      .jsend
      .success(software)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todos software' })
  }
})
module.exports = router
