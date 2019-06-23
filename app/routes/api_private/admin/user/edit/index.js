const router = require('express').Router()
const models = require('../../../../../models')
const { param, check, validationResult } = require('express-validator/check')
const { investigator: Investigator, file: File } = models
const { hasPermission } = require('../../../../../middleweres')

router.put('/:id', [
  hasPermission,
  param('id', 'Parametro id não pode ser nulo')
    .exists()
    .isNumeric({ no_symbols: true })
    .withMessage('Id precisa ser um número'),
  check('email')
    .toString()
    .trim()
    .isEmail()
    .withMessage('Email não é válido')
    .optional(),
  check('password')
    .isLength({ min: 8, max: 255 })
    .withMessage('Password precisa ter no minimo 8 e no máximo 255 caracteres')
    .optional(),
  check('isAdmin')
    .optional()
    .isBoolean()
    .withMessage('isAdmin precisa ser boolean'),
  check('type')
    .optional()
    .matches('^im$|^rf$|^c$|^vr$')
    .withMessage('parâmetro type precisa ser (im ou rf ou c ou vr)')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).jsend.fail({ errors: errors.array() })
  }
  const id = +req.params.id
  const user = req.body
  if (req.user.isAdmin !== true && user.isAdmin === true) {
    return res
      .status(401)
      .jsend
      .fail({
        message: 'Você não tem permissão realizer essa ação'
      })
  }
  const image = (req.files || {}).image
  try {
    await models.sequelize.transaction(async (transaction) => {
      const investigator = await Investigator.findByPk(id)
      if (!investigator) {
        return res
          .status(404)
          .jsend
          .fail({ message: 'Usuário não encontrado.' })
      }
      if (image) {
        if (investigator.fileId) {
          await File.update(image, {
            where: { id: investigator.fileId },
            transaction
          })
        } else {
          const file = await File.create(image, { transaction })
          user.fileId = file.id
        }
      }
      return Investigator.update(user, {
        where: { id: investigator.id },
        transaction
      })
    })
    return res
      .status(200)
      .jsend
      .success(await Investigator.scope('complete').findByPk(id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao atualizar usuário.' })
  }
})

module.exports = router
