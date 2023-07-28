const { StatusCodes } = require("../constants/http");
const { UserType } = require("../constants/user");

const AuthorizeSellerUser = (req, res, next) => {
    try {
        const { userType } = req.user
        if (!req.user || !userType) {
            return res.status(StatusCodes.InternalServerError).send("userType not present in req.user!!");
        }
        if (userType != UserType.Seller) {
            return res.status(StatusCodes.UserForbidden).send("Only Sellers Allowed!!");
        }
    } catch (err) {
        return res.status(StatusCodes.InternalServerError).send(`Error - ${JSON.stringify(err)}`);
    }
    return next();
}

const AuthorizeBuyerUser = (req, res, next) => {
    try {
        const { userType } = req.user
        if (!req.user || !userType) {
            return res.status(StatusCodes.InternalServerError).send("userType not present in req.user!!");
        }
        if (userType != UserType.Buyer) {
            return res.status(StatusCodes.UserForbidden).send("Only Buyers Allowed!!");
        }
    } catch (err) {
        return res.status(StatusCodes.InternalServerError).send(`Error - ${JSON.stringify(err)}`);
    }
    return next();
}

module.exports = {
    AuthorizeSellerUser,
    AuthorizeBuyerUser
}