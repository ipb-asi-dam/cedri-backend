module.exports = function (sequelize, Sequelize) {
  const Communication = sequelize.define('communication', {
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
    startDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    type: {
      type: Sequelize.ENUM('news', 'event', 'media'),
      allowNull: false
    }
  }, {
    paranoid: true,
    timestamps: true,
    freezeTableName: true,
    charset: 'utf8mb4'
  })
  Communication.associate = function (models) {
    Communication.belongsToMany(models.file, {
      through: 'communicationHasManyFiles',
      as: 'files',
      foreignKey: 'communicationId'
    })
  }
  return Communication
}
