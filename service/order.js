const { StatusCodes } = require("../constants/http")
const { CreateNewOrder, GetOrdersBySellerId } = require("../repository/order")
const { FormatApiResponse } = require("../utils/common")
const { GetSellerFullCatalog } = require("./catalog")

const CreateOrder = async (orderReqBody, sellerId, userId) => {
    try {
        //validate request
        const { productList, errorResp } = validateOrderRequest(orderReqBody)
        if (errorResp) {
            return errorResp
        }

        //get seller catalog
        const sellerCatalogResp = await GetSellerFullCatalog(sellerId)
        if(sellerCatalogResp.statusCode != StatusCodes.Success){
            return sellerCatalogResp
        }
        const { catalog: sellerCatalog, products: sellerProducts} = sellerCatalogResp.data
        if(!sellerCatalog){
            return FormatApiResponse(StatusCodes.BadRequest, null, `Invalid Order!! Seller - ${sellerId} does not has any products yet!!`)
        }

        //validate and get order details
        const { totalBill, newOrderDetails, errorResp: error } = validateOrderDetailRequest(sellerProducts, productList)
        if (error) {
            return error
        }

        //create new order with details
        const { order, orderDetails } = await CreateNewOrder(userId, sellerId, totalBill, newOrderDetails)

        const response = {
            order,
            orderDetails
        }

        return FormatApiResponse(StatusCodes.Success, response, 'Your order is confirmed!!')

    } catch (error) {
        return FormatApiResponse(StatusCodes.InternalServerError, null, null, error)
    }
}

const validateOrderRequest = (orderReqBody) => {
    const { products } = orderReqBody

    if (!Array.isArray(products) || products.length == 0) {
        return { errorResp: FormatApiResponse(StatusCodes.BadRequest, null, `{products} should be non empty array of objects - {id, quantity} !!`) }
    }

    let productList = []
    for (let product of products) {
        const productId = String(product.id).trim()
        if (!productId) {
            return { errorResp: FormatApiResponse(StatusCodes.BadRequest, null, `invalid product id passed !!`) }
        }
        let quantity = 0
        if (product.hasOwnProperty('quantity')) {
            quantity = parseInt(String(product.quantity).trim())
            if (!quantity || quantity < 1) {
                return { errorResp: FormatApiResponse(StatusCodes.BadRequest, null, `invalid quantity passed ( >= 1 required) for ${productId} !!`) }
            }
        } else {
            quantity = 1
        }
        productList.push({productId, quantity})
    }

    return { productList, errorResp: null }
}

const validateOrderDetailRequest = (sellerProducts, orderProductList) => {
    //get seller product price map
    let sellerProductPriceMap = {}
    for (const product of sellerProducts) {
        sellerProductPriceMap[product.id] = product.price
    }

    //validate order products belongs to seller and create orderDetail
    let totalBill = 0
    let newOrderDetails = []
    for (const product of orderProductList){
        const productPrice = sellerProductPriceMap[product.productId]
        if(!productPrice){
            return {errorResp: FormatApiResponse(StatusCodes.BadRequest, null, `Invalid Order!! Product - ${product.productId} does not belongs to Seller!!`)}
        }
        const orderDetail = {
            productId: product.productId,
            quantity: product.quantity,
            amount: product.quantity * productPrice
        }
        newOrderDetails.push(orderDetail)
        totalBill += orderDetail.amount
    }

    return {totalBill, newOrderDetails, errorResp: null}
}

const GetSellerOrders = async (sellerId) => {
    try {
        //get seller orders
        const sellerOrders = await GetOrdersBySellerId(sellerId)
        if (!sellerOrders) {
            return FormatApiResponse(StatusCodes.Success, null, `Seller - ${sellerId} does not has any order!!`)
        }

        const response = formatGetSellerOrdersResponse(sellerOrders)
        return FormatApiResponse(StatusCodes.Success, response, `Seller - ${sellerId} has ${sellerOrders.length} orders :)`)

    } catch (error) {
        return FormatApiResponse(StatusCodes.InternalServerError, null, null, error)
    }
}

const formatGetSellerOrdersResponse = (sellerOrders) => {
    let ordersResponse = { orders: {} }
    for (const order of sellerOrders){
        let orderDetails = {}
        for (const orderDetail of order.order_details){
            let currOrderDetails = {
                product: {
                    id: orderDetail.product.id,
                    name: orderDetail.product.name,
                    price: orderDetail.product.price
                },
                quantity: orderDetail.quantity,
                bill: orderDetail.amount
            }
            orderDetails[orderDetail.id] = currOrderDetails
        }
        const orderRes = {
            buyerId: order.user.id,
            totalBill: order.billingAmount,
            status: order.status,
            createdAt: order.createdAt,
            orderDetails: orderDetails
        }
        ordersResponse.orders[order.id] = orderRes
    }
    return ordersResponse
}

module.exports = {
    CreateOrder,
    GetSellerOrders
}