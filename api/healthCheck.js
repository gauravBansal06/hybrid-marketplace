const { Router } = require('express')
const { StatusCodes } = require('../constants/http')
const { FormatApiResponse } = require('../utils/common')

const router = Router()

router.get('/getStatus', async (req, res, next) => {
    try {
        res.status(StatusCodes.Success).json(FormatApiResponse(StatusCodes.Success, null, 'Server is up'))
    } catch (error) {
        next(error)
    }
})

module.exports = router