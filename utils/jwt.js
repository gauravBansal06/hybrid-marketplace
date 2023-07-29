const jwt = require('jsonwebtoken');
const { AuthSecrets } = require('../config')

//create auth token for user
function CreateAuthJwtToken(user) {
    const { id, userType } = user
    let tokenPayload = {
        id,
        userType
    }
    const token = jwt.sign(
        tokenPayload,
        AuthSecrets.SecretKey,
        {
            expiresIn: AuthSecrets.TokenExpiry
        }
    )
    return token
}

//verify auth token for user
function VerifyAuthJwtToken(token) {
    const user = jwt.verify(token, AuthSecrets.SecretKey)
    return user
}

module.exports = {
    CreateAuthJwtToken,
    VerifyAuthJwtToken
}