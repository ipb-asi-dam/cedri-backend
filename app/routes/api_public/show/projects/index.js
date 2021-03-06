const router = require('express').Router()
const getPublicPosts = require('../../../../config/global_modules/getPublicPosts')
const models = require('../../../../models')
const { param, validationResult } = require('express-validator/check')
const { pagination } = require('../../../../middleweres')

router.get('/:type', [
  pagination,
  param('type')
    .exists()
    .withMessage('type não pode ser nulo')
    .toString()
    .matches('^international$|^national$|^other$')
    .withMessage('parâmetro type precisa ser (international, national ou other)')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  const type = req.params.type
  const showAccepted = (req.query.showAccepted === true || req.query.showAccepted === 'true')
  try {
    let elements
    if (req.query.showAccepted) {
      elements = await getPublicPosts(req, models.project, {
        where: {
          type,
          isAccepted: showAccepted
        }
      })
    } else {
      elements = await getPublicPosts(req, models.project, {
        where: {
          type
        }
      })
    }
    return res
      .status(200)
      .jsend
      .success(elements)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao listar todos os projetos' })
  }
})
module.exports = router
