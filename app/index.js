const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const models = require('./models')
const { investigator: Investigator } = models
const cors = require('cors')
const jsend = require('jsend')
const fileUpload = require('express-fileupload')
const app = express()
const fileUploadOptions = {
  abortOnLimit: true,
  safeFileNames: true, // remove hifens etc...
  preserveExtension: true,
  responseOnLimit: 'Tamanho de arquivo excedido, MAX: 1MB'
}

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(jsend.middleware)
app.use(fileUpload(fileUploadOptions))
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
  .sync({ force: true })
  .then(async () => {
    const investigatorAdmin = await Investigator.create({
      name: 'Joe Admin',
      isAdmin: true,
      bio: 'Bio teste',
      password: 'admin123_',
      email: 'guilherme.ianhez2@gmail.com',
      type: 'im'
    })
    const investigatorNormal = await Investigator.create({
      name: 'Joe normal',
      isAdmin: false,
      bio: 'Bio teste',
      password: 'teste123_',
      email: 'teste@gmail.com',
      type: 'im'
    })
    const invCompletoAdmin = await Investigator.scope('complete').findByPk(investigatorAdmin.id)
    const invCompletoNormal = await Investigator.scope('complete').findByPk(investigatorNormal.id)

    console.log(invCompletoAdmin.toJSON())
    console.log(invCompletoNormal.toJSON())
    console.log('Nice! Database looks fine')
  })
  .catch((err) => console.log(err, 'Something went wrong with the Database Update!'))
module.exports = app
