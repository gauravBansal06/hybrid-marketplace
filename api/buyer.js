const { Router } = require('express')
const { GetSellerFullCatalog } = require('../service/catalog')
const { CreateOrder } = require('../service/order')
const { GetListofAllSellers } = require('../service/user')

const router = Router()

router.get('/list-of-sellers', async (req, res, next) => {
    try {
        const result = await GetListofAllSellers()
        res.status(result.statusCode).json(result)
    } catch (error) {
        next(error)
    }
})

router.get('/seller-catalog/:seller_id', async (req, res, next) => {
    try {
        const sellerId = req.params['seller_id']
        const result = await GetSellerFullCatalog(sellerId)
        res.status(result.statusCode).json(result)
    } catch (error) {
        next(error)
    }
})

router.post('/create-order/:seller_id', async (req, res, next) => {
    try {
        const sellerId = req.params['seller_id']
        const userId = req.user.userId
        const result = await CreateOrder(req.body, sellerId, userId)
        res.status(result.statusCode).json(result)
    } catch (error) {
        next(error)
    }
})

module.exports = router