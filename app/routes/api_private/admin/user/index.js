const router = require('express').Router()
const models = require('../../../../models')
const { param, check, validationResult } = require('express-validator/check')
const { investigator: Investigator, login: Login, file: File } = models
const mailer = require('../../../../config/global_modules/mailer-wrap')
const { isAdmin, hasPermission } = require('../../../../middleweres')

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
    .withMessage('O campo email está errado'),
  check('name', 'Atributo name não pode ser nulo')
    .exists()
    .isString()
    .withMessage('Name precisa ser uma string'),
  check('isAdmin', 'Atributo isAdmin não pode ser nulo')
    .exists()
    .isBoolean()
    .withMessage('isAdmin precisa ser booleano')
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
      const loginCreated = await Login.create(user, { transaction })
      user.loginId = loginCreated.id
      const investigator = await Investigator.create(user, { transaction })
      await mailer.newUserEmail({ name: investigator.name, password: user.password, email: loginCreated.email })
      return investigator
    })
    return res
      .status(201)
      .jsend
      .success(await Investigator.scope('basic').findOne({ where: { id: investigadorCreated.id } }))
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao criar investigador' })
  }
})

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
  check('occupation')
    .toString()
    .optional(),
  check('isAdmin')
    .optional()
    .isBoolean()
    .withMessage('isAdmin precisa ser boolean')
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
  const avatar = (req.files || {}).avatar
  try {
    await models.sequelize.transaction(async (transaction) => {
      const investigator = await Investigator.findByPk(id)
      if (!investigator) {
        return res
          .status(404)
          .jsend
          .fail({ message: 'Usuário não encontrado.' })
      }
      if (avatar) {
        let file
        if (investigator.fileId) {
          file = await File.update(avatar, {
            where: { id: investigator.fileId },
            transaction
          })
        } else {
          file = await File.create(avatar, { transaction })
        }
        user.fileId = file.id
      }
      await Login.update(user, {
        where: { id: investigator.loginId }
      }, { transaction })
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
    return res.status(500).send({ success: false, msg: 'Erro ao atualizar usuário.' })
  }
})

router.get('/', isAdmin, async (req, res) => {
  try {
    const users = await Investigator.scope('complete').findAll()
    return res
      .status(200)
      .jsend
      .success(users)
  } catch (err) {
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao listar usuários.' })
  }
})

router.get('/:id', hasPermission, async (req, res) => {
  const id = +req.params.id
  try {
    const user = await Investigator.scope('complete').findByPk(id)
    if (user) {
      return res
        .status(200)
        .jsend
        .success(user)
    } else {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Usuário não encontrado' })
    }
  } catch (err) {
    return res.status(500).send({ success: false, msg: 'Erro ao listar usuários.' })
  }
})
router.get('/:id/files/', hasPermission, async (req, res) => {
  const id = +req.params.id
  try {
    const investigador = await Investigator.findByPk(id)
    if (!investigador) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Usuário não encontrado' })
    }
    const file = await File.findByPk(investigador.fileId)
    return res
      .status(200)
      .jsend
      .success(file ? [{ md5: file.md5, mimetype: file.mimetype }] : [])
  } catch (err) {
    console.log(err)
    return res.status(500).jsend.fail(err)
  }
})

router.get('/:id/files/:hash', hasPermission, async (req, res) => {
  const hash = req.params.hash
  const id = +req.params.id
  try {
    const investigador = await Investigator.findByPk(id)
    if (!investigador) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Usuário não encontrado' })
    }
    const file = await File.findOne({ where: { md5: hash } })
    return res
      .status(200)
      .end(file.data, 'binary')
  } catch (err) {
    console.log(err)
    return res.status(500).jsend.fail(err)
  }
})
module.exports = router
