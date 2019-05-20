const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const models = require('./models');
const User = models.user,
      Investigator = models.investigator;

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//middleware para validar token está dentro de routes
app.use(require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send({success: false, msg: 'Rota não encontrada'});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

models.sequelize
  .sync({force: true})
  .then(() => {
    User.create({
      password: "admin123_",
      email: "admin@gmail.com",
    })
    .then((user) => {
      Investigator.create({
        name: "Admin",
        isAdmin: true,
        bio: "Bio teste",
        userId: user.id
      })
      .then((inv) => {
        console.log(inv.dataValues, 'Nice! Database looks fine')
      })
    });
  })
  .catch((err) => console.log(err, 'Something went wrong with the Database Update!'));


module.exports = app;