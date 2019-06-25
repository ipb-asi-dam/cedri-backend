module.exports = function (sequelize, Sequelize) {
  const News = sequelize.define('news', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(500),
      allowNull: false
    },
    descriptionHtml: {
      type: Sequelize.TEXT('medium'),
      allowNull: false
    }
  })
  News.associate = function (models) {
    News.belongsTo(models.file)
    News.belongsTo(models.investigator)
  }

  News.loadScopes = (models) => {
    News.addScope('posts', () => {
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
    News.addScope('complete', () => {
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

    News.addScope('public', () => {
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
  return News
}
