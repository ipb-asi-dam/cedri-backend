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
    description: {
      type: Sequelize.STRING(5000),
      allowNull: false
    }
  })
  News.associate = function (models) {
    News.belongsTo(models.file)
  }

  News.loadScopes = (models) => {
    News.addScope('posts', () => {
      return {
        attributes: ['id',
          'title',
          'createdAt',
          [models.Sequelize.col('investigator.name'), 'author'],
          [models.Sequelize.literal(`'news'`), 'type']
        ],
        include: [{
          model: models.investigator,
          attributes: []
        }]
      }
    })
  }
  return News
}
