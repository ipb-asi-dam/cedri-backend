const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../../app/config/config.json')[env]
const Op = Sequelize.Op
const sequelize = new Sequelize(config.database, config.username, config.password, { operatorsAliases: { $and: Op.and, $between: Op.between }, ...config })
const db = {}

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

Object.keys(db).forEach((modelName) => {
  if ('loadScopes' in db[modelName]) {
    db[modelName].loadScopes(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize
module.exports = db
