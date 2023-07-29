const { Router } = require('express')
const { GetSellerFullCatalog } = require('../service/catalog')
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

module.exports = router