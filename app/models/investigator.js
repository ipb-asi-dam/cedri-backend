module.exports = function(sequelize, Sequelize){
    const Investigator = sequelize.define('investigator', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER(11),
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        bio: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        isAdmin: {
            type: Sequelize.BOOLEAN
        },
    }, {
        paranoid: false,
        timestamps: false,
        freezeTableName: true, 
    });
    Investigator.associate = function (models){
        Investigator.belongsTo(models.user);
        Investigator.belongsTo(models.occupation);
    }

    return Investigator;
}