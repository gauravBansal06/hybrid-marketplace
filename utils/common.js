const bcrypt = require('bcryptjs')
const { ValidNameRegexp } = require('../constants/user')

const EncryptPassword = (password) => {
    const encryptedPwd = bcrypt.hashSync(password)
    return encryptedPwd
}

const ComparePassword = (password, encryptedPassword) => {
    const isSame = bcrypt.compareSync(password, encryptedPassword)
    return isSame
}

const FormatApiResponse = (statusCode, data = null, message = null , error = null) => {
    return {
        statusCode,
        data,
        message,
        error: !error ? error : {
            errMessage: error.message,
            stackTrace: error.stack
        }
    }
}

const ValidateAlphaNumericString = (testString) => {
    const alphaRegExp = new RegExp(ValidNameRegexp)
    return alphaRegExp.test(testString) 
}

module.exports  = {
    EncryptPassword,
    ComparePassword,
    FormatApiResponse,
    ValidateAlphaNumericString
}