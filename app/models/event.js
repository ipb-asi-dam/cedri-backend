module.exports = function (sequelize, Sequelize) {
  const Event = sequelize.define('event', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(500),
      allowNull: false
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    links: {
      type: Sequelize.STRING(5000),
      allowNull: false
    }
  })
  Event.associate = function (models) {
    Event.belongsTo(models.investigator)
  }

  Event.loadScopes = (models) => {
    Event.addScope('posts', () => {
      return {
        attributes: ['id',
          'title',
          'createdAt',
          [models.Sequelize.col('investigator.name'), 'author'],
          [models.Sequelize.literal(`'event'`), 'type']
        ],
        include: [{
          model: models.investigator,
          attributes: []
        }]
      }
    })
  }
  return Event
}