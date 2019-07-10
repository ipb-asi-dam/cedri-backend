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
    .matches('^phd$|^msc$')
    .withMessage('parâmetro type precisa ser (phd ou msc)')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  const type = req.params.type
  const showYear = req.query.showYear
  const optionsObj = showYear ? {
    where: {
      $and: [
        { type },
        models.sequelize.where(models.sequelize.fn('YEAR', models.sequelize.col('date')), showYear)
      ]
    }
  } : { where: { type } }
  try {
    const elements = await getPublicPosts(req, models.these, optionsObj)
    return res
      .status(200)
      .jsend
      .success(elements)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao listar todas as teses' })
  }
})
module.exports = router
