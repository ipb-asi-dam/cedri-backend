const router = require('express').Router()
const getPublicPosts = require('../../../../../config/global_modules/getPublicPosts')
const models = require('../../../../../models')
const { param, validationResult } = require('express-validator/check')
const { pagination } = require('../../../../../middleweres')
router.get('/:type', [
  pagination,
  param('type')
    .exists()
    .withMessage('type não pode ser nulo')
    .toString()
    .matches('^b$|^bc$|^j$|^p$|^e$')
    .withMessage('parâmetro type precisa ser (j ou b ou bc ou p ou e)')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  const type = req.params.type
  try {
    const elements = await getPublicPosts(req, models.publication, {
      where: {
        type
      },
      order: [['date', 'DESC']]
    })
    return res
      .status(200)
      .jsend
      .success(elements)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao listar todas as publicações' })
  }
})
module.exports = router
