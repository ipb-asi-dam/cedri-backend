const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const { these: These } = require('../../../../../models')

router.post('/', [
  check('title')
    .exists()
    .withMessage('Campo title não pode ser nulo')
    .toString()
    .trim(),
  check('student')
    .exists()
    .withMessage('Campo student não pode ser nulo')
    .toString()
    .trim(),
  check('grade')
    .exists()
    .withMessage('Campo grade não pode ser nulo')
    .toString()
    .trim(),
  check('institute')
    .exists()
    .withMessage('Campo institute não pode ser nulo')
    .toString()
    .trim(),
  check('supervisors')
    .exists()
    .withMessage('Campo supervisors não pode ser nulo')
    .toString()
    .trim(),
  check('type')
    .exists()
    .withMessage('type não pode ser nulo')
    .toString()
    .matches('^phd$|^msc$')
    .withMessage('parâmetro type precisa ser (phd ou msc)'),
  check('date')
    .exists()
    .withMessage('Campo date não pode ser nulo')
    .isISO8601()
    .withMessage('Formato date errado. Valor esperado (YYYY ou YYYY-MM ou YYYY-MM-DD')

], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  const these = req.body
  try {
    const theseCreated = await These.create(these)
    return res
      .status(201)
      .jsend
      .success(await These.scope('posts').findByPk(theseCreated.id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao inserir these' })
  }
})

module.exports = router
