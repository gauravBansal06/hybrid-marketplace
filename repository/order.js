const { sequelize } = require("../config/database")
const { OrderStatus } = require("../constants/order")
const { Order, OrderDetails, User, Product } = require("../models")

const createOrder = async (userId, sellerId, billingAmount, transaction = null) => {
    return Order.create({
        userId: userId,
        sellerId: sellerId,
        billingAmount: billingAmount,
        status: OrderStatus.Confirmed,
        isActive: true
    }, { transaction })
}

const createOrderDetails = async (productId, orderId, quantity, amount, transaction = null) => {
    return OrderDetails.create({
        productId: productId,
        orderId: orderId,
        quantity: quantity,
        amount: amount,
        isActive: true
    }, { transaction })
}

const CreateNewOrder = async (userId, sellerId, totalBill, newOrderDetails) => {
    const transaction = await sequelize.transaction()
    try {
        const order = await createOrder(userId, sellerId, totalBill, transaction)
        let orderDetails = []
        for (const reqOrderDetail of newOrderDetails) {
            const { productId, quantity, amount } = reqOrderDetail
            const orderDetail = await createOrderDetails(productId, order.id, quantity, amount, transaction)
            orderDetails.push(orderDetail)
        }
        await transaction.commit()
        return {
            order,
            orderDetails
        }
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

const GetOrdersBySellerId = async (sellerId) => {
    return Order.findAll({
        where: {
            sellerId: sellerId,
            isActive: true,
        },
        include: [
            {
                model: OrderDetails,
                required: true,
                include: [{
                    model: Product,
                    required: true
                }]
            },
            {
                model: User,
                where: {
                    isActive: true
                }
            }
        ],
        order: [['created_at', 'DESC']]
    })
}

module.exports = {
    CreateNewOrder,
    GetOrdersBySellerId
}