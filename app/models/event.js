module.exports = function(sequelize, Sequelize){
    const Event = sequelize.define('event', {
        id: {
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        local:{
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        paranoid: false,
        timestamps: false,
        freezeTableName: true, 
    });
    Event.associate = function(models){
        Event.belongsTo(models.communication);
    }
    return Event;
}