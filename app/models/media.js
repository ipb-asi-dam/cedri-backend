module.exports = function(sequelize, Sequelize){
    const Media = sequelize.define('media', {
        id: {
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }, {
        paranoid: false,
        timestamps: false,
        freezeTableName: true, 
    });
    Media.associate = function(models){
        Media.belongsTo(models.communication);
    }
    return Media;
}