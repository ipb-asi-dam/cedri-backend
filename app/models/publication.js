module.exports = function(sequelize, Sequelize) {
    const Publication = sequelize.define('publication', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER(11),
        },
        authors: {
            type: Sequelize.STRING(1024),
            allowNull: false,
        },
        title: {
            type: Sequelize.STRING(500),
            allowNull: false,
        },
        year: {
            type: Sequelize.INTEGER(4).UNSIGNED,
            allowNull: false,
        },
        sourceTitle: {
            type: Sequelize.STRING(500),
            allowNull: false,
        },
        volume: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        issue: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        artNumber: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        startPage: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        endPage: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        url: {
            type: Sequelize.STRING(3000),
            allowNull: false,
        },
        doi: {
            type: Sequelize.STRING,
            allowNull: true,
        },        
        indexed: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        type: {
            type: Sequelize.ENUM('j', 'b', 'bc', 'p', 'e'),
            allowNull: false,
        },
    }, {
        paranoid: false,
        timestamps: false,
        freezeTableName: true,
    });

    Publication.associate = function(models){
        Publication.belongsTo(models.investigator);
    }

    Publication.loadScopes = (models) => {
        Publication.addScope('complete', () => {
            return {
                include: [
                    {
                        model: models.investigator,
                        attributes: ['id', 'name', 'bio', 'isAdmin', 'occupation']
                    }
                ]
            }
        })
    }

    return Publication;
}