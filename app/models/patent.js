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
    patentNumbersHtml: {
      type: Sequelize.TEXT('medium'),
      allowNull: false
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
          'authors',
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
    Patent.addScope('complete', () => {
      return {
        attributes: { exclude: ['investigatorId'] },
        include: [
          {
            model: models.investigator,
            attributes: ['id', 'name', 'isAdmin', 'email']
          }
        ]
      }
    })
  }
  return Patent
}
