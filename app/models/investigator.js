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
    }
  }, {
    paranoid: false,
    timestamps: false,
    freezeTableName: true
  })
  Investigator.associate = function (models) {
    Investigator.belongsTo(models.login)
    Investigator.hasMany(models.publication)
    Investigator.hasMany(models.project)
    Investigator.belongsTo(models.file)
  }
  Investigator.loadScopes = (models) => {
    Investigator.addScope('complete', () => {
      return {
        attributes: ['id', 'name', 'bio', 'isAdmin', 'occupation', 'fileId'],
        required: true,
        include: [
          {
            model: models.login,
            attributes: ['id', 'email'],
            required: true
          }
        ]
      }
    })
    Investigator.addScope('basic', () => {
      return {
        attributes: ['id', 'name', 'isAdmin', 'fileId'],
        required: true,
        include: [{
          model: models.login,
          attributes: ['id', 'email'],
          required: true
        }
        ]
      }
    })
  }
  return Investigator
}
