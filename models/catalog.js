const { Seller } = require('./seller')
const { sequelize, DataTypes } = require('../config/database')

const Catalog = sequelize.define(
    'catalog',
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
        sellerId: {
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
        underscored: true,
        indexes: [
            {
                unique: true,     //overrides index by foreign key and create unique index
                fields: ['seller_id']
            }
        ],
        
    }
)

Catalog.belongsTo(Seller)
Seller.hasOne(Catalog)

module.exports = {
    Catalog
}