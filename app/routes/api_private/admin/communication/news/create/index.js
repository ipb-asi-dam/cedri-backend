const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')

router.post('/', [
  check('')
    .exists()
    .withMessage('')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
})
module.exports = router
