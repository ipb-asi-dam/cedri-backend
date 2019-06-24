module.exports = function (sequelize, Sequelize) {
  const Media = sequelize.define('media', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(500),
      allowNull: false
    },
    links: {
      type: Sequelize.STRING(5000),
      allowNull: true
    }
  })
  Media.associate = function (models) {
    Media.belongsTo(models.investigator)
    Media.belongsToMany(models.file, {
      through: 'mediaHasManyFiles',
      as: 'files',
      foreignKey: 'mediaId'
    })
  }

  Media.loadScopes = (models) => {
    Media.addScope('posts', () => {
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
  }
  return Media
}
