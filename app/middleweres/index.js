const jwt = require('jsonwebtoken')
const env = process.env.NODE_ENV || 'development'
const HttpStatus = require('http-status-codes')
const { API_SECRET } = require('../config/config.json')[env]
const middlewares = {}

middlewares.removeNull = async (req, res, next) => {
  const body = Object
    .entries(req.body)
    .reduce((acumulado, atual) => {
      if (atual[1] === 'null') {
        return { ...acumulado, [atual[0]]: null }
      }

      return { ...acumulado, [atual[0]]: atual[1] }
    }, {})
  req.body = body
  next()
}
middlewares.isValidToken = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']

  if (req.method === 'OPTIONS') {
    return next()
  }
  if (token) {
    await jwt.verify(token, API_SECRET, (error, decoded) => {
      if (error) {
        return res
          .status(403)
          .jsend.fail({ message: 'Token é inválido! Por favor, tente entrar novamente' })
      }

      req.user = decoded
      return next()
    })
  } else {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .jsend.fail({ message: 'Nenhum token fornecido!' })
  }
}

middlewares.isAdmin = (req, res, next) => {
  if (req.user.isAdmin === true) {
    next()
  } else {
    return res
      .status(401)
      .jsend
      .fail({
        message: 'Sem permissão para realizar essa ação'
      })
  }
}

middlewares.hasPermission = (req, res, next) => {
  if (req.user.isAdmin !== true && +req.user.id !== +req.params.id) {
    return res
      .status(401)
      .jsend
      .fail({
        message: 'Você não tem permissão realizer essa ação'
      })
  } else {
    return next()
  }
}

module.exports = middlewares
