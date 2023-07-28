const { StatusCodes } = require("../constants/http")
const { ValidNewRegistrationUserTypes, UserType, ValidNameLengths } = require("../constants/user")
const { GetUserByUserName, CreateUser, CreateSellerUser, GetSellerByUserId, GetAllSellers } = require("../repository/user")
const { FormatApiResponse, EncryptPassword, ValidateAlphaNumericString, ComparePassword } = require("../utils/common")
const { CreateAuthJwtToken } = require("../utils/jwt")

const RegisterUser = async (regReqBody) => {
    try {
        //validate request
        const { regReq, errorResp } = validateRegisterUserRequest(regReqBody)
        if (errorResp) {
            return errorResp
        }

        const { userName, password, userType, sellerName } = regReq

        const existingUser = await GetUserByUserName(userName)
        if (existingUser && existingUser.id) {
            return FormatApiResponse(StatusCodes.BadRequest, null, 'Username already exists! Please choose another one.')
        }

        //generate password hash
        const encryptedPassword = EncryptPassword(password)

        //create new user
        let newUser = {}
        if (userType == UserType.Seller) {
            const sellerUser = await CreateSellerUser(userName, encryptedPassword, sellerName)
            newUser = {
                ...sellerUser.user.dataValues,
                seller: sellerUser.seller.dataValues
            }
        } else {
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
        return FormatApiResponse(StatusCodes.InternalServerError, null, null, JSON.stringify(error))
    }
}

const LoginUser = async (loginReqBody) => {
    try {
        //validate request
        const { loginReq, errorResp } = validateLoginUserRequest(loginReqBody)
        if (errorResp) {
            return errorResp
        }

        const { userName, password } = loginReq

        //verify username
        let user = await GetUserByUserName(userName)
        if (!user) {
            return FormatApiResponse(StatusCodes.BadRequest, null, 'User does not exist!!')
        }

        //verify password
        const isVerified = ComparePassword(password, user.password)
        if (!isVerified) {
            return FormatApiResponse(StatusCodes.BadRequest, null, 'Password does not match!!')
        }

        //get seller if seller userType
        if (user.userType == UserType.Seller) {
            const seller = await GetSellerByUserId(user.id)
            if (!seller) {
                throw new Error("userType is seller but seller does not exist!!") //currently throwing error as this needs to be there during registration
            }
            user = {
                ...user.dataValues,
                seller: seller.dataValues
            }
        }

        //generate auth token
        const token = CreateAuthJwtToken(user)

        const response = {
            user,
            AuthorizationHeader: token,
        }
        return FormatApiResponse(StatusCodes.Success, response, 'Login Successful!! Pls note AuthorizationHeader to access marketplace', null)

    } catch (error) {
        return FormatApiResponse(StatusCodes.InternalServerError, null, null, JSON.stringify(error))
    }
}

const validateRegisterUserRequest = (regReqBody) => {
    const { userName, password, userType, sellerName } = regReqBody
    const regReq = {
        userName: userName ? String(userName).trim() : "",
        password: password ? String(password).trim() : "",
        userType: userType ? String(userType).trim() : "",
        sellerName: sellerName ? String(sellerName).trim() : ""
    }
    if (!regReq.userName || !regReq.password) {
        return { errorResp: FormatApiResponse(StatusCodes.BadRequest, null, 'Username and password both are required!!', null) }
    }
    if (!ValidNewRegistrationUserTypes.includes(regReq.userType)) {
        return { errorResp: FormatApiResponse(StatusCodes.BadRequest, null, `userType should be one of [${ValidNewRegistrationUserTypes}]!!`, null) }
    }
    if (regReq.userType == UserType.Seller && (regReq.sellerName.length > ValidNameLengths.Default || !ValidateAlphaNumericString(regReq.sellerName))) {
        return { errorResp: FormatApiResponse(StatusCodes.BadRequest, null, `{sellerName}(alpha-numeric value of max ${ValidNameLengths.Default} chars) required for Seller registration!!`, null) }
    }
    if (regReq.userName.length > ValidNameLengths.MaxUserNameLen || !ValidateAlphaNumericString(regReq.userName)) {
        return { errorResp: FormatApiResponse(StatusCodes.BadRequest, null, `Username should be alphanumeric and max of ${ValidNameLengths.MaxUserNameLen} chars!!`, null) }
    }
    if (regReq.password.length < ValidNameLengths.MinPasswordLen) {
        return { errorResp: FormatApiResponse(StatusCodes.BadRequest, null, `Password should be minimum of ${ValidNameLengths.MinPasswordLen} chars`, null) }
    }
    return { regReq, errorResp: null }
}

const validateLoginUserRequest = (loginReqBody) => {
    const { userName, password } = loginReqBody
    const loginReq = {
        userName: userName ? String(userName).trim() : "",
        password: password ? String(password).trim() : "",
    }
    if (!loginReq.userName || !loginReq.password) {
        return { errorResp: FormatApiResponse(StatusCodes.BadRequest, null, 'Username and password both are required!!', null) }
    }
    return { loginReq, errorResp: null }
}

const GetListofAllSellers = async () => {
    try {
        const sellers = await GetAllSellers()
        if (!sellers || sellers.length == 0) {
            return FormatApiResponse(StatusCodes.Success, null, 'No sellers found!!')
        }
        return FormatApiResponse(StatusCodes.Success, sellers)
    } catch (error) {
        return FormatApiResponse(StatusCodes.InternalServerError, null, null, JSON.stringify(error))
    }
}

module.exports = {
    RegisterUser,
    LoginUser,
    GetListofAllSellers
}