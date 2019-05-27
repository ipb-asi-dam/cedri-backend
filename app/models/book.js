module.exports = function(sequelize, Sequelize) {
    const Book = sequelize.define('book', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER(11),
        },
        address: {
            type: Sequelize.STRING(500),
            allowNull: true,
        },
        startDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        endDate: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        number: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        volume: {
            type: Sequelize.INTEGER,
            allowNull: true,
        }
    }, {
        paranoid: false,
        timestamps: false,
        freezeTableName: true,
    });

    Book.associate = function(models){
        Book.belongsTo(models.publication);
    }

    Book.loadScopes = (models) => {
        Book.addScope('complete', () => {
            return {
                attributes: ['id', 'address', 'startDate', 'endDate', 'number', 'volume'],
                required: true,
                include: [
                    {
                        model: models.publication,
                        required: true
                    },
                ],
            }
        })
    }
    return Book;
}