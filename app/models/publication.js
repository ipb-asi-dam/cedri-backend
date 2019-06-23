module.exports = function (sequelize, Sequelize) {
  const Publication = sequelize.define('publication', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER(11)
    },
    authors: {
      type: Sequelize.STRING(1024),
      allowNull: false
    },
    title: {
      type: Sequelize.STRING(500),
      allowNull: false
    },
    year: {
      type: Sequelize.DATE,
      allowNull: false
    },
    sourceTitle: {
      type: Sequelize.STRING(500),
      allowNull: false
    },
    volume: {
      type: Sequelize.STRING,
      allowNull: true
    },
    issue: {
      type: Sequelize.STRING,
      allowNull: true
    },
    artNumber: {
      type: Sequelize.STRING,
      allowNull: true
    },
    startPage: {
      type: Sequelize.STRING,
      allowNull: true
    },
    endPage: {
      type: Sequelize.STRING,
      allowNull: true
    },
    url: {
      type: Sequelize.STRING(2000),
      allowNull: false
    },
    doi: {
      type: Sequelize.STRING,
      allowNull: true
    },
    indexed: {
      type: Sequelize.STRING,
      allowNull: true
    },
    type: {
      type: Sequelize.ENUM('j', 'b', 'bc', 'p', 'e'),
      allowNull: false
    }
  })

  Publication.associate = function (models) {
    Publication.belongsTo(models.investigator)
  }

  Publication.loadScopes = (models) => {
    Publication.addScope('complete', () => {
      return {

        attributes: {
          exclude: [ 'investigatorId' ]
        },
        include: [
          {
            model: models.investigator,
            attributes: ['id', 'name', 'bio', 'isAdmin', 'occupation']
          }
        ]
      }
    })
    Publication.addScope('posts', () => {
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
  }

  return Publication
}
