module.exports = function (sequelize, Sequelize) {
  const Patents = sequelize.define('patent', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(1000),
      allowNull: false
    },
    reference: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    link: {
      type: Sequelize.STRING(2000),
      allowNull: false
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false
    }
  }, {
    paranoid: false,
    timestamps: false,
    freezeTableName: true
  })
  Patents.associate = function (models) {
    Patents.belongsTo(models.investigator)
  }
  return Patents
}
