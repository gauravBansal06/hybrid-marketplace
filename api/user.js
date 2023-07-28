const { Router } = require('express')
const { RegisterUser } = require('../service/user')

const router = Router()

router.post('/register', async (req, res, next) => {
    try {
        const result = await RegisterUser(req.body)
        res.status(result.statusCode).json(result)
    } catch (error) {
        next(error)
    }
})

module.exports = router