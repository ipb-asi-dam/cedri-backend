const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const models = require('./models')
const { investigator: Investigator } = models
const cors = require('cors')
const jsend = require('jsend')
const fileUpload = require('express-fileupload')
const app = express()
const middleware = require('../app/middleweres')
const fileUploadOptions = {
  abortOnLimit: true,
  limits: { fileSize: 16 * 1024 * 1024 },
  limitHandler: function (req, res, next) {
    return res
      .status(422)
      .jsend
      .fail({ message: 'Tamanho de arquivo excedido. Maximo 16MB' })
  },
  safeFileNames: true, // remove hifens etc...
  preserveExtension: true
}

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(jsend.middleware)
app.use(fileUpload(fileUploadOptions))
app.use(middleware.removeNull)
// middleware para validar token está dentro de routes
app.use(require('./routes'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send({ success: false, msg: 'Rota não encontrada' })
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

models.sequelize
  .sync()
  .then(async () => {
    const investigatorAdmin = (await Investigator.findOrCreate({
      where: {
        email: 'admin@gmail.com'
      },
      defaults: {
        name: 'Admin',
        isAdmin: true,
        password: 'admin123_',
        type: 'im'
      }
    }))[0]
    const invCompletoAdmin = await Investigator.scope('complete').findByPk(investigatorAdmin.id)

    console.log(invCompletoAdmin.toJSON())
    console.log('Nice! Database looks fine')
  })
  .catch((err) => console.log(err, 'Something went wrong with the Database Update!'))
module.exports = app
