module.exports = function (sequelize, Sequelize) {
  const Award = sequelize.define('award', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    authors: {
      type: Sequelize.STRING(500),
      allowNull: false
    },
    title: {
      type: Sequelize.STRING(1000),
      allowNull: false
    }
  }, {
    paranoid: false,
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8mb4'
  })
  Award.associate = function (models) {
    Award.belongsTo(models.investigator)
  }

  return Award
}
