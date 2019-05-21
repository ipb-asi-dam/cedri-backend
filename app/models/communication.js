module.exports = function(sequelize, Sequelize){
    const Communication = sequelize.define('communication', {
        id: {
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        link: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }, {
        paranoid: false,
        timestamps: false,
        freezeTableName: true, 
    });
    Communication.associate = function(models){
        Communication.hasOne(models.media);
        Communication.hasOne(models.event);
        Communication.hasOne(models.news);
    }
    return Communication;
}