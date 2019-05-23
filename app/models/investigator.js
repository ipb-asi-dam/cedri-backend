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
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        paranoid: false,
        timestamps: false,
        freezeTableName: true, 
    });
    Investigator.associate = function (models){
        Investigator.belongsTo(models.user);
        Investigator.belongsTo(models.occupation);
        Investigator.hasMany(models.project);
    }
    Investigator.loadScopes = (models) => {
        Investigator.addScope('complete', () => {
            return {
                attributes: ['id', 'name', 'bio', 'isAdmin'],
                required: true,
                include: [
                    {
                        model: models.occupation,
                        attributes: ['name'],
                    },
                    {
                        model: models.user,
                        attributes: ['email', 'avatar'],
                        required: true
                    },
                ],
            };
        });
    }
    return Investigator;
}