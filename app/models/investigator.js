const bCrypt = require('bcryptjs')

module.exports = function (sequelize, Sequelize) {
  const Investigator = sequelize.define('investigator', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER(11)
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    bio: {
      type: Sequelize.STRING,
      allowNull: true
    },
    occupation: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    },
    type: {
      type: Sequelize.ENUM('im', 'rf', 'c', 'vr'),
      allowNull: false
    }
  }, {
    paranoid: true,
    timestamps: true,
    freezeTableName: true,
    charset: 'utf8mb4'
  })
  Investigator.associate = function (models) {
    Investigator.hasMany(models.publication)
    Investigator.hasMany(models.project)
    Investigator.belongsTo(models.file)
  }
  Investigator.loadScopes = (models) => {
    Investigator.addScope('complete', () => {
      return {
        attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] }
      }
    })
    Investigator.addScope('basic', () => {
      return {
        attributes: ['id', 'name', 'isAdmin', 'fileId', 'email', 'type']
      }
    })
  }
  const generateHash = (password) => {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null)
  }

  Investigator.beforeCreate((investigator, options) => {
    investigator.setDataValue('password', generateHash(investigator.password))
  })

  Investigator.beforeUpdate((investigator, options) => {
    if (investigator.password && investigator.changed('password')) {
      investigator.setDataValue('password', generateHash(investigator.password))
    }
  })
  return Investigator
}
