const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const model = require('../../../../../models')
const { award: Award } = model

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

module.exports = router
