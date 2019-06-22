module.exports = function (sequelize, Sequelize) {
  const These = sequelize.define('these', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(1000),
      allowNull: false
    },
    student: {
      type: Sequelize.STRING,
      allowNull: false
    },
    grade: {
      type: Sequelize.STRING,
      allowNull: false
    },
    institute: {
      type: Sequelize.STRING,
      allowNull: false
    },
    completed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    supervisors: {
      type: Sequelize.STRING(500),
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM('phd', 'msc'),
      allowNull: false
    }
  })
  These.associate = function (models) {
    These.belongsTo(models.investigator)
  }
  return These
}
