module.exports = function(sequelize, Sequelize){
    const Occupation = sequelize.define('occupation', {
        id: {
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }, {
        paranoid: false,
        timestamps: false,
        freezeTableName: true, 
    });
    Occupation.associate = function(models){
        Occupation.hasMany(models.investigator);
    }
    return Occupation;
}