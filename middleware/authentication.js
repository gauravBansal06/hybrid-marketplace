const { AuthorizationHeaderKey, StatusCodes } = require('../constants/http')
const { VerifyAuthJwtToken } = require('../utils/jwt')

const AuthenticateUser = (req, res, next) => {
    const token = req.headers[AuthorizationHeaderKey]
    if (!token) {
        return res.status(StatusCodes.UserUnauthorised).send(`${AuthorizationHeaderKey} header is missing!!`);
    }
    try {
        const decodedPayload = VerifyAuthJwtToken(token)
        req.user = {
            userId: decodedPayload.id,
            userType: decodedPayload.userType,
            sellerId: decodedPayload.sellerId
        }
    } catch (err) {
        return res.status(StatusCodes.UserUnauthorised).send("Invalid Token! Please Register or Login!!");
    }
    return next();
}

module.exports = AuthenticateUser