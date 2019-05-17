module.exports = function(sequelize, Sequelize) {
    const User = sequelize.define('user', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER(11),
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        avatarPath: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {
        paranoid: true,
        timestamps: true,
        freezeTableName: true,
    });

    User.associate = function(models){
        User.hasOne(models.investigator);
    }
    return User;
}