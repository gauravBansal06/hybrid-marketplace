const { Order } = require('./order')
const { Product } = require('./product')
const { sequelize, DataTypes } = require('../config/database')

const OrderDetails = sequelize.define(
    'order_details',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        productId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        orderId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                customValidator(value) {
                    if (value < 1) {
                      throw new Error("quantity cannot be less than 1");
                    }
                  }
            }
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
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

Order.hasMany(OrderDetails)
OrderDetails.belongsTo(Order)

OrderDetails.belongsTo(Product)
Product.hasMany(OrderDetails)

module.exports = {
    OrderDetails
}