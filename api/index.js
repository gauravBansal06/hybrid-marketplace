const { Router } = require('express')
const { AuthMiddleware } = require('../middleware')
const healthCheckRouter = require('./healthCheck')
const authRouter = require('./auth')

const router = Router()

router.use('/health', healthCheckRouter)
router.use('/auth', authRouter)

router.use(AuthMiddleware) //after this, authentication required for each api

module.exports = router
