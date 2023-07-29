const { Router } = require('express')
const { AuthMiddleware, AuthorizeBuyerMiddleware, AuthorizeSellerMiddleware } = require('../middleware')

const healthCheckRouter = require('./healthCheck')
const authRouter = require('./auth')
const buyerRouter = require('./buyer')
const sellerRouter = require('./seller')

const router = Router()

router.use('/health-check', healthCheckRouter)
router.use('/auth', authRouter)

router.use(AuthMiddleware) //after this, authentication required for each api

router.use('/buyer', AuthorizeBuyerMiddleware, buyerRouter) //authorising only buyers type user to access
router.use('/seller', AuthorizeSellerMiddleware, sellerRouter) //authorising only sellers type user to access

module.exports = router
