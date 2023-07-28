const bcrypt = require('bcryptjs')

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
        error
    }
}

const ValidateAlphaNumericString = (testString) => {
    const alphaRegExp = new RegExp(/^[a-z0-9]+$/i)
    return alphaRegExp.test(testString) 
}

module.exports  = {
    EncryptPassword,
    ComparePassword,
    FormatApiResponse,
    ValidateAlphaNumericString
}