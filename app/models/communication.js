module.exports = function (sequelize, Sequelize) {
  const Communication = sequelize.define('communication', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    url: {
      type: Sequelize.STRING(2000),
      allowNull: false
    },
    context: {
      type: Sequelize.STRING,
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    local: {
      type: Sequelize.STRING,
      allowNull: true
    },
    type: {
      type: Sequelize.ENUM('news', 'event', 'media'),
      allowNull: false
    }
  }, {
    paranoid: false,
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8mb4'
  })
  Communication.associate = function (models) {
    Communication.belongsTo(models.investigator)
  }
  Communication.loadScopes = (models) => {
    Communication.addScope('complete', () => {
      return {

        attributes: {
          exclude: ['investigatorId']
        },
        include: [
          {
            model: models.investigator,
            attributes: ['id', 'name', 'bio', 'isAdmin', 'occupation']
          }
        ]
      }
    })
  }
  return Communication
}
