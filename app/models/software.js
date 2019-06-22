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
      type: Sequelize.STRING(1024),
      allowNull: false
    }
  }, {
    paranoid: false,
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8mb4'
  })
  Software.associate = function (models) {
    Software.belongsTo(models.investigator)
    Software.belongsTo(models.file)
  }

  return Software
}
