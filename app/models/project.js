module.exports = function (sequelize, Sequelize) {
  const Project = sequelize.define('project', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(500),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(3000),
      allowNull: false
    },
    fundedBy: {
      type: Sequelize.STRING,
      allowNull: false
    },
    consortium: {
      type: Sequelize.STRING(2000),
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
    webPage: {
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
    Project.addScope('public', () => {
      return {
        attributes: { exclude: ['fileId', 'investigatorId'] },
        include: [{
          model: models.file,
          attributes: ['id', 'mimetype', 'md5']
        }]
      }
    })
    Project.addScope('posts', () => {
      return {
        attributes: ['id',
          'title',
          'createdAt',
          [models.Sequelize.col('investigator.name'), 'author'],
          'isAccepted'
        ],
        include: [{
          model: models.investigator,
          attributes: []
        }]
      }
    })
    Project.addScope('complete', () => {
      return {
        attributes: { exclude: ['investigatorId', 'fileId'] },
        include: [
          {
            model: models.file,
            attributes: ['id', 'md5', 'mimetype']
          },
          {
            model: models.investigator,
            attributes: ['id', 'name', 'isAdmin', 'email']
          }
        ]
      }
    })
  }
  return Project
}
