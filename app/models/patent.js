module.exports = function (sequelize, Sequelize) {
  const Patent = sequelize.define('patent', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(1000),
      allowNull: false
    },
    authors: {
      type: Sequelize.STRING(1024),
      allowNull: false
    },
    patentNumbers: {
      type: Sequelize.STRING(1400),
      allowNull: true
    }
  }, {
    paranoid: true,
    timestamps: true,
    freezeTableName: true,
    charset: 'utf8mb4'
  })
  Patent.associate = function (models) {
    Patent.belongsTo(models.investigator)
  }

  return Patent
}
