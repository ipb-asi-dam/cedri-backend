const router = require('express').Router()
const getPublicPosts = require('../../../../config/global_modules/getPublicPosts')
const models = require('../../../../models')
const { param, validationResult } = require('express-validator/check')

router.get('/:type', [
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
  try {
    const elements = await getPublicPosts(req, models.project, {
      where: {
        type
      }
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
      .error({ message: 'Erro ao listar todos os projetos' })
  }
})
module.exports = router
