module.exports = function (sequelize, Sequelize) {
  const Media = sequelize.define('media', {
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
    freezeTableName: true,
    charset: 'utf8mb4'
  })
  Media.associate = function (models) {
    Media.belongsTo(models.communication)
    Media.belongsTo(models.file)
  }
  Media.loadScopes = (models) => {
    Media.addScope('complete', () => {
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
  return Media
}
