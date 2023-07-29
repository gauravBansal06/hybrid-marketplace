const { StatusCodes } = require("../constants/http");
const { UserType } = require("../constants/user");
const { GetSellerByUserId } = require("../repository/user");

const AuthorizeSellerUser = async (req, res, next) => {
    try {
        const { userId, userType } = req.user
        if (!req.user || !userType ) {
            return res.status(StatusCodes.InternalServerError).send("userType or userId not found in req.user!!");
        }
        if (userType != UserType.Seller) {
            return res.status(StatusCodes.UserForbidden).send("Only Sellers Allowed!!");
        }
        const seller = await GetSellerByUserId(userId)
        if (!seller){
            return res.status(StatusCodes.UserUnauthorised).send(`seller record not found for user - ${decodedPayload.id} !!`)
        }
        req.user.sellerId = seller.id
        
    } catch (err) {
        return res.status(StatusCodes.InternalServerError).send(`Error - ${JSON.stringify(err)}`);
    }
    return next();
}

const AuthorizeBuyerUser = (req, res, next) => {
    try {
        const { userType, userId } = req.user
        if (!req.user || !userType || !userId) {
            return res.status(StatusCodes.InternalServerError).send("userType or userId not found in req.user!!");
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