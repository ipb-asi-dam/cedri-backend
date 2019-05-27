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
        occupation: {
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
        Investigator.hasMany(models.publication);
        Investigator.hasMany(models.project);
    }
    Investigator.loadScopes = (models) => {
        Investigator.addScope('complete', () => {
            return {
                attributes: ['id', 'name', 'bio', 'isAdmin', 'occupation'],
                required: true,
                include: [
                    {
                        model: models.user,
                        attributes: ['email', 'avatar'],
                        required: true
                    },
                ],
            };
        });
        Investigator.addScope('basic', () => {
            return {
                attributes: ['id', 'name', 'isAdmin'],
                required: true,
                include: [{
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