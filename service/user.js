const { StatusCodes } = require("../constants/http")
const { ValidNewRegistrationUserTypes, UserType, ValidNameLengths } = require("../constants/user")
const { GetUserByUserName, CreateUser, CreateSellerUser } = require("../repository/user")
const { FormatApiResponse, EncryptPassword, ValidateAlphaNumericString } = require("../utils/common")
const { CreateAuthJwtToken } = require("../utils/jwt")

const RegisterUser = async (userReqBody) => {
    try {
        //validate request
        const { userReq, errorResp } = validateRegisterUserRequest(userReqBody)
        if (errorResp){
            return errorResp
        }

        const {userName, password, userType, sellerName} = userReq

        const existingUser = await GetUserByUserName(userName)
        if (existingUser && existingUser.id) {
            return FormatApiResponse(StatusCodes.BadRequest, null, 'Username already exists! Please choose another one.')
        }

        //generate password hash
        const encryptedPassword = EncryptPassword(password)

        //create new user
        let newUser = {}
        if(userType == UserType.Seller){
            const sellerUser = await CreateSellerUser(userName, encryptedPassword, sellerName)
            newUser = {
                ...sellerUser.user.dataValues,
                seller: sellerUser.seller.dataValues
            }
        } else{
            const user = await CreateUser(userName, encryptedPassword, UserType.Buyer)
            newUser = {
                ...user.dataValues
            }
        }

        //create jwt token
        const token = CreateAuthJwtToken(newUser)

        const response = {
            newUser,
            AuthorizationHeader: token
        }
        return FormatApiResponse(StatusCodes.Success, response, 'User Successfully created!! Pls note AuthorizationHeader to access marketplace', null)

    } catch (error) {
        return FormatApiResponse(StatusCodes.InternalServerError, null, null, error)
    }
}

const validateRegisterUserRequest = (userReqBody) => {
    const {userName, password, userType, sellerName} = userReqBody
    const userReq = {
        userName: userName ? String(userName).trim() : "",
        password: password ? String(password).trim() : "",
        userType: userType ? String(userType).trim() : "",
        sellerName: sellerName ? String(sellerName).trim() : ""
    }
    if (!userReq.userName || !userReq.password) {
        return {errorResp: FormatApiResponse(StatusCodes.BadRequest, null, 'Username and password both are required', null)}
    }
    if (!ValidNewRegistrationUserTypes.includes(userReq.userType)){
        return {errorResp: FormatApiResponse(StatusCodes.BadRequest, null, `userType should be one of [${ValidNewRegistrationUserTypes}]`, null)}
    }
    if (userReq.userType == UserType.Seller && !ValidateAlphaNumericString(userReq.sellerName)){
        return {errorResp: FormatApiResponse(StatusCodes.BadRequest, null, `{sellerName}(alpha-numeric value) required for Seller registration`, null)}
    }
    if (userReq.userName.length > ValidNameLengths.MaxUserNameLen || !ValidateAlphaNumericString(userReq.userName)){
        return {errorResp: FormatApiResponse(StatusCodes.BadRequest, null, `Username should be alphanumeric and max of 10 chars`, null)}
    }
    if (userReq.password.length < ValidNameLengths.MinPasswordLen){
        return {errorResp: FormatApiResponse(StatusCodes.BadRequest, null, `Password should be minimum of ${ValidNameLengths.MinPasswordLen} chars`, null)}
    }
    return {userReq, errorResp: null}
}

module.exports = {
    RegisterUser
}