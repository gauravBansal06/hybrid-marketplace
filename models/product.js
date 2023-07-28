const { sequelize, DataTypes } = require('../config/database')
const { Catalog } = require('./catalog')

const Product = sequelize.define(
    'product',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            length: 50,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        catalogId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        freezeTableName: true,
        underscored: true
    }
)

Catalog.hasMany(Product)
Product.belongsTo(Catalog)
/*
Assuming one product belongs to one catalog only and different sellers have different products.
This can easily be changed into m:m relationship if same product belongs to multiple sellers
*/

module.exports = {
    Product
}