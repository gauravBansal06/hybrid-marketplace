const { Router } = require('express')
const { AuthMiddleware, AuthorizeBuyerMiddleware, AuthorizeSellerMiddleware } = require('../middleware')

const healthCheckRouter = require('./healthCheck')
const authRouter = require('./auth')
const buyerRouter = require('./buyer')

const router = Router()

router.use('/health-check', healthCheckRouter)
router.use('/auth', authRouter)

router.use(AuthMiddleware) //after this, authentication required for each api

router.use('/buyer', AuthorizeBuyerMiddleware, buyerRouter) //authorising only buyers type user to access

module.exports = router
