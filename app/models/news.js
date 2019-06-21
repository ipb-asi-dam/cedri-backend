module.exports = function (sequelize, Sequelize) {
  const News = sequelize.define('news', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    paranoid: false,
    timestamps: false,
    freezeTableName: true
  })
  News.associate = function (models) {
    News.belongsTo(models.communication)
    News.belongsTo(models.file)
  }
  News.loadScopes = (models) => {
    News.addScope('complete', () => {
      return {
        attributes: ['id', 'description'],
        required: true,
        include: [
          {
            model: models.communication,
            attributes: ['name'],
            required: true
          }
        ]
      }
    })
  }
  return News
}
