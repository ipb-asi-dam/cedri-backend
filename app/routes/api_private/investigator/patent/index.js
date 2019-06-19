const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')

router.post('/', [
  check('title')
    .exists()
    .withMessage('Campo title não pode ser nulo')
    .toString()
    .trim(),
  check('reference')
    .exists()
    .withMessage('Campo reference não pode ser nulo')
    .toString()
    .trim(),
  check('url')
    .exists()
    .withMessage('Campo url não pode ser nulo')
    .toString()
    .trim(),
  check('date')
    .exists()
    .withMessage('Campo date não pode ser nulo')
    .toDate()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  return res.status(200).jsend.success(req.body)
})
module.exports = router
