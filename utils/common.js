const FormatApiResponse = (statusCode, data = null, message = null , error = null) => {
    return {
        statusCode,
        data,
        message,
        error
    }
}

module.exports  = {
    FormatApiResponse
}