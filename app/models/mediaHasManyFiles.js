module.exports = function (sequelize, Sequelize) {
  const MediaHasManyFiles = sequelize.define('mediaHasManyFiles', {
    mediaId: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'media',
        key: 'id'
      }
    },
    fileId: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'file',
        key: 'id'
      }
    }
  })
  MediaHasManyFiles.associate = function (models) {
  }
  return MediaHasManyFiles
}
