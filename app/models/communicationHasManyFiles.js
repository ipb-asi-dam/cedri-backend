module.exports = function (sequelize, Sequelize) {
  const Communication = sequelize.define('communicationHasManyFiles', {
    communicationId: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 'communication',
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
  Communication.associate = function (models) {
  }
  return Communication
}
