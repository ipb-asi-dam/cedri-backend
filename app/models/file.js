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
      allowNull: false,
      unique: true
    }

  }, {
    paranoid: false,
    timestamps: false,
    freezeTableName: true
  })
  File.associate = function (models) {
    File.hasOne(models.investigator)
  }
  return File
}
