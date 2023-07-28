const { Router } = require('express')
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

module.exports = router