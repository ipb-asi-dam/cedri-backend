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

  }, {
    paranoid: true,
    timestamps: true,
    freezeTableName: true
  })
  File.associate = function (models) {
    File.hasOne(models.investigator)
    File.hasOne(models.software)
    File.hasOne(models.project)
<<<<<<< HEAD
    File.belongsToMany(models.communication, {
      through: 'communicationHasManyFiles',
      as: 'communications',
      foreignKey: 'fileId'
    })
=======
    File.hasOne(models.communication)
>>>>>>> a3aca0906fa20d9c2f8357fb8a30cf0e5a64a14d
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
