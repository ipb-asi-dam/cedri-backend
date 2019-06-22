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
  }, {
    paranoid: false,
    timestamps: false,
    freezeTableName: true
  })
  Communication.associate = function (models) {
  }
  return Communication
}
