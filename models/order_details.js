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
            type: DataTypes.UUID
        },
        orderId: {
            type: DataTypes.UUID
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

Order.hasMany(OrderDetails, {
    foreignKey: {
        name: 'order_id',
        allowNull: false
    } 
})
OrderDetails.belongsTo(Order)
OrderDetails.belongsTo(Product, {
    foreignKey: {
        name: 'product_id',
        allowNull: false
    }
})

module.exports = {
    OrderDetails
}