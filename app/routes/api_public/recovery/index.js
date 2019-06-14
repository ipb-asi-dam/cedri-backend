const router = require('express').Router()
const models = require('../../../models')
const Login = models.login
const Investigator = models.investigator
const env = process.env.NODE_ENV || 'development'
const { API_SECRET } = require('../../../config/config.json')[env]
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator/check')
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
    let investigador = await Investigator.findOne({
      include: [{
        model: Login,
        attributes: ['email'],
        where: {
          email: req.body.email
        }
      }]
    })
    if (investigador) {
      investigador = investigador.dataValues
      const token = jwt.sign({
        id: investigador.userId,
        isAdmin: investigador.isAdmin
      }, API_SECRET, {
        expiresIn: '15m'
      })
      investigador.token = token
      try {
        await mailer.sendRecoveryEmail(investigador)
        res.status(200)
          .jsend
          .success({ message: 'Email enviado com sucesso!' })
      } catch (err) {
        return res
          .status(500)
          .jsend
          .error({ message: 'Erro ao enviar email' })
      }
    } else {
      return res.status(404)
        .jsend
        .fail({ message: 'Usuário não encontrado' })
    }
  } catch (err) {
    return res.status(500)
      .jsend
      .error({ message: 'Não foi possivel concluir a solicitação de recovery' })
  }
})

module.exports = router
