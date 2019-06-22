module.exports = function (sequelize, Sequelize) {
  const Project = sequelize.define('project', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    fundedBy: {
      type: Sequelize.STRING,
      allowNull: false
    },
    consortium: {
      type: Sequelize.STRING,
      allowNull: true
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    url: {
      type: Sequelize.STRING(2000),
      allowNull: true
    },
    isAccepted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    type: {
      type: Sequelize.ENUM('international', 'national', 'other'),
      allowNull: false
    }
  }, {
    paranoid: true,
    timestamps: true,
    freezeTableName: true,
    charset: 'utf8mb4'
  })
  Project.associate = function (models) {
    Project.belongsTo(models.investigator)
    Project.belongsTo(models.file)
  }
  Project.loadScopes = (models) => {
    Project.addScope('basic', () => {
      return {
        attributes: ['id', 'title', 'isAccepted']
      }
    })
  }
  return Project
}
