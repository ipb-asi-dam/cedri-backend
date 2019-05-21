module.exports = function(sequelize, Sequelize){
    const Project = sequelize.define('project', {
        id: {
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },
        photo: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        financedBy: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        consortium: {
            type: Sequelize.STRING,
            allowNull: true,
        }
    }, {
        paranoid: false,
        timestamps: false,
        freezeTableName: true, 
    });
    Project.associate = function(models){
        Project.belongsTo(models.investigator);
    }
    return Project;
}