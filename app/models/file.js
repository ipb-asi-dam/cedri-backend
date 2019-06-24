module.exports = function (sequelize, Sequelize) {
  const File = sequelize.define('file', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    data: {
      type: Sequelize.BLOB('medium'),
      allowNull: false
    },
    mimetype: {
      type: Sequelize.STRING,
      allowNull: false
    },
    md5: {
      type: Sequelize.STRING(32),
      primaryKey: true,
      allowNull: false
    }

  })
  File.associate = function (models) {
    File.hasOne(models.investigator)
    File.hasOne(models.news)
    File.hasOne(models.software)
    File.hasOne(models.project)
    File.belongsToMany(models.media, {
      through: 'mediaHasManyFiles',
      as: 'media',
      foreignKey: 'fileId'
    })
  }
  File.loadScopes = (models) => {
    File.addScope('basic', () => {
      return {
        attributes: { exclude: ['data'] }
      }
    })
  }
  return File
}
