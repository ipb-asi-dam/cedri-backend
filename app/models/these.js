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
      allowNull: false
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
  These.loadScopes = (models) => {
    These.addScope('posts', () => {
      return {
        attributes: ['id',
          'title',
          'createdAt',
          [models.Sequelize.col('investigator.name'), 'author']
        ],
        include: [{
          model: models.investigator,
          attributes: []
        }]
      }
    })
    These.addScope('public', () => {
      return {
        attributes: {
          exclude: ['investigatorId']
        }
      }
    })
    These.addScope('complete', () => {
      return {
        attributes: {
          exclude: ['investigatorId']
        },
        include: [{
          model: models.investigator,
          attributes: ['id', 'name', 'isAdmin', 'email']
        }]
      }
    })
  }
  return These
}
