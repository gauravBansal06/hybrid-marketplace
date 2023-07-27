const LogIncomingRequests = (req, res, next) => {
    const reqObject = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        pathParams: req.params,
        queryParams: req.query,
        body: req.body
    }
    console.log(`***********`)
    console.log(`Recieved new request - ${JSON.stringify(reqObject)}`)
    console.log(`***********`)


    return next();
}

module.exports = LogIncomingRequests