const router = require('express').Router()
const models = require('../../../../../models')
const { check, validationResult } = require('express-validator/check')
const { investigator: Investigator } = models
const mailer = require('../../../../../config/global_modules/mailer-wrap')
const { isAdmin } = require('../../../../../middleweres')

const shuffle = (word) => {
  const a = word.split('')
  const n = a.length

  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  }
  return a.join('')
}

const makePassword = (lengthCharacter, lengthNumber, lengthSpecialCharacter) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const numbers = '1234567890'
  const specialCharacters = '!@#$%&*_-+.,'
  const charactersLength = characters.length
  const numbersLength = numbers.length
  const specialCharacterLength = specialCharacters.length

  for (let i = 0; i < lengthCharacter; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  for (let i = 0; i < lengthNumber; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbersLength))
  }
  for (let i = 0; i < lengthSpecialCharacter; i++) {
    result += specialCharacters.charAt(Math.floor(Math.random() * specialCharacterLength))
  }
  return shuffle(result)
}

router.post('/', [
  isAdmin,
  check('email', 'Atributo email não pode ser nulo')
    .exists()
    .toString()
    .trim()
    .isEmail()
    .withMessage('O campo email é inválido'),
  check('name', 'Atributo name não pode ser nulo')
    .exists()
    .toString(),
  check('isAdmin', 'Atributo isAdmin não pode ser nulo')
    .exists()
    .isBoolean()
    .withMessage('isAdmin precisa ser booleano'),
  check('type')
    .exists()
    .withMessage('type não pode ser nulo')
    .matches(/^im$|^rf$|^c$|^vr$/)
    .withMessage('parâmetro type precisa ser (im ou rf ou c ou vr)')

], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  const user = req.body
  user.password = makePassword(4, 3, 1)
  try {
    const investigadorCreated = await models.sequelize.transaction(async (transaction) => {
      const investigator = await Investigator.create(user, { transaction })
      await mailer.newUserEmail(user)
      return investigator
    })
    return res
      .status(201)
      .jsend
      .success(await Investigator.scope('complete').findByPk(investigadorCreated.id))
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao criar investigador' })
  }
})

router.post('/:id/undelete', isAdmin, async (req, res) => {
  const id = +req.params.id
  try {
    const investigator = await Investigator.scope('complete').findByPk(id, { paranoid: false })
    if (!investigator) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Usuário não existe' })
    }
    investigator.restore()
    return res
      .status(200)
      .jsend
      .success(investigator)
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao realizar ação de undelete do usuário' + id })
  }
})

module.exports = router
