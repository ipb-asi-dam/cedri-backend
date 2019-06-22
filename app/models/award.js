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
          [models.Sequelize.col('investigator.name'), 'author'],
          [models.Sequelize.literal(`'award'`), 'type']
        ],
        include: [{
          model: models.investigator,
          attributes: []
        }]
      }
    })
  }

  return Award
}
