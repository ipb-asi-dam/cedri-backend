const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const { patent: Patent } = require('../../../../../models')

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

module.exports = router
