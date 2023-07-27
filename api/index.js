const { Router } = require('express')
const healthCheckRouter = require('./healthCheck')

const router = Router()

router.use(healthCheckRouter)

module.exports = router
