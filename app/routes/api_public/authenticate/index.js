const router = require('express').Router()
const models = require('../../../models')
const Login = models.login
const Investigator = models.investigator
const bcrypt = require('bcryptjs')
const env = process.env.NODE_ENV || 'development'
const isProduction = process.env.NODE_ENV === 'production'
const { API_SECRET } = require('../../../config/config.json')[env]
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator/check')

router.post('/', [
  check('email')
    .exists()
    .withMessage('Atributo email não pode ser nulo')
    .toString()
    .trim()
    .isEmail()
    .withMessage('Email não é válido.'),
  check('password')
    .exists()
    .withMessage('Atributo password não pode ser nulo')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() })
  }
  const user = req.body
  try {
    const loginReturn = await Login.findOne({
      where: {
        email: user.email
      }
    })
    const match = await bcrypt.compare(user.password, loginReturn.dataValues.password)
    if (match) {
      const investigador = await Investigator.findByPk(loginReturn.dataValues.id)
      const token = jwt.sign({
        id: investigador.dataValues.id,
        isAdmin: investigador.dataValues.isAdmin
      }, API_SECRET, {
        expiresIn: isProduction ? '9h' : '10000h'
      })
      return res
        .status(200)
        .jsend
        .success({
          token: token
        })
    } else {
      return res
        .status(401)
        .jsend
        .fail({
          message: 'Falha ao realizar autenticação, credenciais erradas!'
        })
    }
  } catch (err) {
    return res
      .status(403)
      .jsend
      .fail({
        message: 'Falha ao realizar autenticação!'
      })
  }
})

module.exports = router
