module.exports = function(sequelize, Sequelize) {
    const Publication = sequelize.define('publication', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER(11),
        },
        authors: {
            type: Sequelize.STRING(500),
            allowNull: true,
        },
        link: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        month: {
            type: Sequelize.INTEGER(2).UNSIGNED,
            allowNull: true,
        },
        year: {
            type: Sequelize.INTEGER(4).UNSIGNED,
            allowNull: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        pages: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    }, {
        paranoid: false,
        timestamps: false,
        freezeTableName: true,
    });

    Publication.associate = function(models){
        Publication.belongsTo(models.investigator);
        Publication.hasOne(models.book);
    }
    return Publication;
}