module.exports = function(sequelize, Sequelize){
    const News = sequelize.define('news', {
        id: {
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },
        photo: {
            type: Sequelize.STRING,
            allowNull: false,
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
    News.associate = function(models){
        News.belongsTo(models.communication);
    }
    return News;
}