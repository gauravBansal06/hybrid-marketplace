const { AuthorizationHeaderKey, StatusCodes } = require('../constants/http');
const { GetUserById } = require('../repository/user');
const { VerifyAuthJwtToken } = require('../utils/jwt')

const AuthenticateUser = async (req, res, next) => {
    const token = req.headers[AuthorizationHeaderKey]
    if (!token) {
        return res.status(StatusCodes.UserUnauthorised).send(`${AuthorizationHeaderKey} header is missing!!`);
    }
    try {
        const decodedPayload = VerifyAuthJwtToken(token)
        const user = await GetUserById(decodedPayload.id)
        if (!user){
            return res.status(StatusCodes.UserUnauthorised).send(`user from token - ${decodedPayload.id} does not exist!!`)
        }
        req.user = {
            userId: user.id,
            userType: user.userType
        }

    } catch (err) {
        return res.status(StatusCodes.UserUnauthorised).send("Invalid Token! Please Register or Login!!");
    }
    return next();
}

module.exports = AuthenticateUser