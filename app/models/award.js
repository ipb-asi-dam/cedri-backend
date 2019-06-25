module.exports = function (sequelize, Sequelize) {
  const Award = sequelize.define('award', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(1000),
      allowNull: false
    },
    prizeWinners: {
      type: Sequelize.STRING(500),
      allowNull: false
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true
    },
    event: {
      type: Sequelize.STRING,
      allowNull: true
    }
  })

  Award.associate = function (models) {
    Award.belongsTo(models.investigator)
  }
  Award.loadScopes = (models) => {
    Award.addScope('posts', () => {
      return {
        attributes: ['id',
          'title',
          'createdAt',
          [models.Sequelize.col('investigator.name'), 'author']
        ],
        include: [{
          model: models.investigator,
          attributes: []
        }]
      }
    })
    Award.addScope('public', () => {
      return {
        attributes: {
          exclude: ['investigatorId']
        }
      }
    })
    Award.addScope('complete', () => {
      return {
        attributes: {
          exclude: ['investigatorId']
        },
        include: [{
          model: models.investigator,
          attributes: ['id', 'name', 'isAdmin', 'email']
        }]
      }
    })
  }

  return Award
}
