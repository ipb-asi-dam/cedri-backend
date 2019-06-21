module.exports = function (sequelize, Sequelize) {
  const Event = sequelize.define('event', {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    local: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    paranoid: false,
    timestamps: false,
    freezeTableName: true
  })
  Event.associate = function (models) {
    Event.belongsTo(models.communication)
  }
  Event.loadScopes = (models) => {
    Event.addScope('complete', () => {
      return {
        attributes: ['id', 'date', 'local'],
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
  return Event
}
