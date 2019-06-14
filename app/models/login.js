const bCrypt = require('bcryptjs')

module.exports = function (sequelize, Sequelize) {
  const Login = sequelize.define('login', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER(11)
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    paranoid: true,
    timestamps: true,
    freezeTableName: true
  })

  Login.associate = function (models) {
    Login.hasOne(models.investigator)
  }

  const generateHash = (password) => {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null)
  }

  Login.beforeCreate((login, options) => {
    login.setDataValue('password', generateHash(login.password))
  })

  Login.beforeUpdate((login, options) => {
    if (login.password && login.changed('password')) {
      login.setDataValue('password', generateHash(login.password))
    }
  })
  return Login
}
