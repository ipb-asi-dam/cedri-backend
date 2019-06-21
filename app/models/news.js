module.exports = function (sequelize, Sequelize) {
  const News = sequelize.define('news', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: Sequelize.STRING(2000),
      allowNull: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    paranoid: false,
    timestamps: false,
    freezeTableName: true,
    charset: 'utf8mb4'
  })
  News.associate = function (models) {
    News.belongsTo(models.communication)
  }
  return News
}
