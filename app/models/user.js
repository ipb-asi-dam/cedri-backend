const bCrypt = require('bcrypt-nodejs');

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
            defaultValue: 'testeAvatar'
        },
    }, {
        paranoid: true,
        timestamps: true,
        freezeTableName: true,
    });

    User.associate = function(models){
        User.hasOne(models.investigator);
    }

    const generateHash = (password) => {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };

    User.beforeCreate((user, options) => {
        user.setDataValue('password', generateHash(user.password));
    });

    User.beforeUpdate((user, options) => {
        if (user.password && user.changed('password')) {
            user.setDataValue('password', generateHash(user.password));
        }
    });
    return User;
}