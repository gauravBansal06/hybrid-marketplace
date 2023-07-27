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
        buyerId: {
            type: DataTypes.UUID
        },
        sellerId: {
            type: DataTypes.UUID
        },
        billingAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            values: [OrderStatus.Confirmed, OrderStatus.Cancelled, OrderStatus.Delivered],
            allowNull: false,
            defaultValue: OrderStatus.Confirmed
        },
        iaActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        freezeTableName: true,
        underscored: true
    }
)

Order.belongsTo(User, {
    foreignKey: {
        name: 'buyer_id',
        allowNull: false
    }
})

Order.belongsTo(Seller, {
    foreignKey: {
        name: 'seller_id',
        allowNull: false
    }
})
Seller.hasMany(Order)

module.exports = {
    Order
}