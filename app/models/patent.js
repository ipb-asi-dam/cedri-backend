module.exports = function (sequelize, Sequelize) {
  const Patent = sequelize.define('patent', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(1000),
      allowNull: false
    },
    authors: {
      type: Sequelize.STRING(1024),
      allowNull: false
    },
    patentNumbers: {
      type: Sequelize.STRING(5000),
      allowNull: true
    }
  })
  Patent.associate = function (models) {
    Patent.belongsTo(models.investigator)
  }

  Patent.loadScopes = (models) => {
    Patent.addScope('posts', () => {
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
    Patent.addScope('public', () => {
      return {
        attributes: {
          exclude: ['investigatorId']
        }
      }
    })
  }
  return Patent
}
