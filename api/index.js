const { Router } = require('express')
const healthCheckRouter = require('./healthCheck')
const authRouter = require('./auth')

const router = Router()

router.use(healthCheckRouter)
router.use('/auth', authRouter)

module.exports = router
