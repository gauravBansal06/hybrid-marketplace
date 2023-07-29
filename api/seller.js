const { Router } = require('express')
const { CreateSellerCatalog } = require('../service/catalog')

const router = Router()

router.post('/create-catalog', async (req, res, next) => {
    try {
        const { sellerId } = req.user
        const result = await CreateSellerCatalog(req.body, sellerId)
        res.status(result.statusCode).json(result)
    } catch (error) {
        next(error)
    }
})

module.exports = router