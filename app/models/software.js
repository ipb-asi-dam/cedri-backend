module.exports = function (sequelize, Sequelize) {
  const Software = sequelize.define('software', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(1000),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(3000),
      allowNull: false
    }
  })
  Software.associate = function (models) {
    Software.belongsTo(models.investigator)
    Software.belongsTo(models.file)
  }
  Software.loadScopes = (models) => {
    Software.addScope('posts', () => {
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
    Software.addScope('complete', () => {
      return {
        attributes: { exclude: ['fileId', 'investigatorId'] },
        include: [
          {
            model: models.file,
            attributes: ['id', 'md5', 'mimetype']
          },
          {
            model: models.investigator,
            attributes: ['id', 'name', 'isAdmin', 'email']
          }
        ]
      }
    })
    Software.addScope('public', () => {
      return {
        attributes: {
          exclude: ['investigatorId', 'fileId']
        },
        include: [{
          model: models.file,
          attributes: ['id', 'mimetype', 'md5']
        }]
      }
    })
  }

  return Software
}
