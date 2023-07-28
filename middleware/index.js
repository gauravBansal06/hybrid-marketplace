const AuthenticateUser = require('./authentication')
const { AuthorizeSellerUser, AuthorizeBuyerUser } = require('./authorization')
const LoggerMiddleware = require('./logger')

module.exports = {
    LoggerMiddleware,
    AuthMiddleware: AuthenticateUser,
    AuthorizeSellerMiddleware: AuthorizeSellerUser,
    AuthorizeBuyerMiddleware: AuthorizeBuyerUser
}