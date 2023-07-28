const { sequelize, DataTypes } = require('../config/database')
const { OrderStatus } = require('../constants/order')
const { User } = require('./user')
const { Seller } = require('./seller')

const Order = sequelize.define(
    'order',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        sellerId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        billingAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            values: [OrderStatus.Confirmed, OrderStatus.Cancelled, OrderStatus.Delivered],
            allowNull: false,
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

Order.belongsTo(User)
Order.belongsTo(Seller)

Seller.hasMany(Order)
User.hasMany(Order)

module.exports = {
    Order
}