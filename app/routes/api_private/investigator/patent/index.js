const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const { patent: Patent } = require('../../../../models')
const { hasPermissionPosts } = require('../../../../middleweres')
router.post('/', [
  check('title')
    .exists()
    .withMessage('Campo title não pode ser nulo')
    .toString()
    .trim(),
  check('authors')
    .exists()
    .withMessage('Campo authors não pode ser nulo')
    .toString()
    .trim(),
  check('patentNumbers')
    .optional()
    .toString()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  const patent = req.body
  try {
    const patentCreated = await Patent.create(patent)
    return res
      .status(201)
      .jsend
      .success(await Patent.scope('posts').findByPk(patentCreated.id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao inserir Patent' })
  }
})

router.put('/:id', async (req, res) => {
  const id = +req.params.id
  const patent = req.body
  try {
    const _patent = await Patent.findByPk(id)
    if (!_patent) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Patent com id ' + id + ' não existe' })
    }
    if (!hasPermissionPosts(req.user, _patent.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para editar esse post' })
    }
    await Patent.update(patent, {
      where: {
        id
      }
    })
    return res
      .status(200)
      .jsend
      .success(await Patent.scope('posts').findByPk(id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .error({ message: 'Erro ao inserir Patent' })
  }
})

router.get('/', async (req, res) => {
  try {
    const patents = await Patent.findAll()
    return res
      .status(200)
      .jsend
      .success(patents)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todas patentes' })
  }
})
router.get('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const patent = await Patent.findOne({
      where: {
        id
      }
    })
    if (!patent) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Patent com id ' + id + ' não encontrada' })
    }
    return res
      .status(200)
      .jsend
      .success(patent)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todas patentes' })
  }
})
module.exports = router
