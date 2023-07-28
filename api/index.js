const { Router } = require('express')
const healthCheckRouter = require('./healthCheck')
const userRouter = require('./user')

const router = Router()

router.use(healthCheckRouter)
router.use('/user', userRouter)

module.exports = router
