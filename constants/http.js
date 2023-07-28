const AuthrizationHeaderKey = "Authorization"

const StatusCodes = {
    Success: 200,
    BadRequest: 400,
    UserUnauthorised: 401,
    UserForbidden: 403,
    InternalServerError: 500
}

module.exports = {
    AuthrizationHeaderKey,
    StatusCodes
}