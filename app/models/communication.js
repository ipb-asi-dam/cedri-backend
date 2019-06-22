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
<<<<<<< HEAD
    description: {
=======
    url: {
      type: Sequelize.STRING(2000),
      allowNull: true
    },
    context: {
      type: Sequelize.STRING(2000),
      allowNull: true
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    local: {
>>>>>>> a3aca0906fa20d9c2f8357fb8a30cf0e5a64a14d
      type: Sequelize.STRING,
      allowNull: true
    },
    type: {
      type: Sequelize.ENUM('news', 'event', 'media'),
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
<<<<<<< HEAD
    Communication.belongsToMany(models.file, {
      through: 'communicationHasManyFiles',
      as: 'files',
      foreignKey: 'communicationId'
=======
    Communication.belongsTo(models.investigator)
    Communication.belongsTo(models.file)
  }
  Communication.loadScopes = (models) => {
    Communication.addScope('complete', () => {
      return {
        attributes: {
          exclude: ['investigatorId']
        },
        include: [
          {
            model: models.investigator,
            attributes: ['id', 'name', 'bio', 'isAdmin', 'occupation']
          }
        ]
      }
>>>>>>> a3aca0906fa20d9c2f8357fb8a30cf0e5a64a14d
    })
  }
  return Communication
}
