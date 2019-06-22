module.exports = function (sequelize, Sequelize) {
  const Communication = sequelize.define('communication', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    type: {
      type: Sequelize.ENUM('news', 'event', 'media'),
      allowNull: false
    }
  })
  Communication.associate = function (models) {
    Communication.belongsToMany(models.file, {
      through: 'communicationHasManyFiles',
      as: 'files',
      foreignKey: 'communicationId'
    })
  }

  Communication.loadScopes = (models) => {
    Communication.addScope('posts', () => {
      return {
        attributes: ['id',
          'title',
          'createdAt',
          [models.Sequelize.col('investigator.name'), 'author'],
          [models.Sequelize.literal(`'communication'`), 'type']
        ],
        include: [{
          model: models.investigator,
          attributes: []
        }]
      }
    })
  }
  return Communication
}
