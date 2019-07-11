const router = require('express').Router()
const models = require('../../../models')
const Investigator = models.investigator
const env = process.env.NODE_ENV || 'development'
const { API_SECRET, frontIp } = require('../../../config/config.json')[env]
const jwt = require('jsonwebtoken')
const { query, check, validationResult } = require('express-validator/check')
const mailer = require('../../../config/global_modules/mailer-wrap')

router.post('/', [
  check('email')
    .exists()
    .withMessage('Email não pode ser nulo')
    .toString()
    .trim()
    .isEmail()
    .withMessage('Campo email inválido!')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() })
  }
  try {
    let investigador = await Investigator.scope('complete').findOne({
      where: {
        email: req.body.email
      }
    })
    if (!investigador) {
      return res.status(404)
        .jsend
        .fail({ message: 'Usuário não encontrado' })
    }

    investigador = investigador.dataValues
    const token = jwt.sign({
      id: investigador.id,
      isAdmin: investigador.isAdmin
    }, API_SECRET, {
      expiresIn: '15m'
    })
    investigador.token = token
    investigador.frontIp = frontIp
    try {
      await mailer.sendRecoveryEmail(investigador)
      return res.status(200)
        .jsend
        .success({ message: 'Email enviado com sucesso!' })
    } catch (err) {
      console.log(err)
      return res
        .status(500)
        .jsend
        .error({ message: 'Erro ao enviar email' })
    }
  } catch (err) {
    console.log(err)
    return res.status(500)
      .jsend
      .error({ message: 'Não foi possivel concluir a solicitação de recovery' })
  }
})

router.put('/', [
  check('password')
    .exists()
    .withMessage('Campo password não pode ser nulo')
    .isLength({ min: 8, max: 255 })
    .withMessage('Password precisa ter no minimo 8 e no máximo 255 caracteres'),
  query('token')
    .exists()
    .withMessage('query token não pode ser nulo')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() })
  }
  const token = req.query.token
  jwt.verify(token, API_SECRET, async (error, decoded) => {
    if (error) {
      return res
        .status(403)
        .jsend.fail({ message: 'Token é inválido! Por favor, tente entrar novamente' })
    }
    const investigator = await Investigator.findByPk(decoded.id)
    if (!investigator) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Investigador de id ' + decoded.id + '' })
    }
    await investigator.update(req.body, { fields: ['password'] })
    return res
      .status(200)
      .jsend
      .success({ message: 'Senha alterada com sucesso!' })
  })
})

module.exports = router
