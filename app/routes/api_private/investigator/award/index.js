const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const { award: Award } = require('../../../../models')
const { hasPermission } = require('../../../../middleweres')

router.post('/', [
  check('title')
    .exists()
    .withMessage('Campo title não pode ser nulo')
    .toString()
    .trim(),
  check('prizeWinners')
    .exists()
    .withMessage('Campo prizeWinners não pode ser nulo')
    .toString()
    .trim(),
  check('date')
    .exists()
    .withMessage('Campo date não pode ser nulo')
    .isISO8601()
    .withMessage('Formato date errado. Valor esperado (YYYY ou YYYY-MM ou YYYY-MM-DD)')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  const award = req.body
  try {
    const awardCreated = await Award.create(award)
    return res
      .status(201)
      .jsend
      .success(await Award.scope('posts').findByPk(awardCreated.id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao inserir prêmio' })
  }
})

router.put('/:id', hasPermission, async (req, res) => {
  const id = +req.params.id
  const award = req.body
  try {
    const _award = await Award.findByPk(id)
    if (!_award) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Prêmio com id ' + id + 'não encontrado.' })
    }
    await Award.update(award, {
      where: {
        id
      }
    })
    return res
      .status(200)
      .jsend
      .success(await Award.scope('posts').findByPk(id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao realizer upgrade no prêmio com id' + id })
  }
})

router.delete('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const award = await Award.destroy({
      where: {
        id
      }
    })
    if (!award) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Prêmio com id ' + id + ' não encontrado' })
    }
    return res
      .status(200)
      .jsend
      .success({ message: 'Prêmio deletado com sucesso!' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao deletar prêmio com id ' + id })
  }
})

router.get('/', async (req, res) => {
  try {
    const awards = await Award.findAll()
    return res
      .status(200)
      .jsend
      .success(awards)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todos os prêmios' })
  }
})

router.get('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const award = await Award.findByPk(id)
    if (!award) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Prêmio de id ' + id + 'não encontrado.' })
    }
    return res
      .status(200)
      .jsend
      .success(award)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todos os prêmios' })
  }
})

module.exports = router
