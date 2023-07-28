const { UserType } = require('../constants/user')
const { User, Seller } = require('../models')

const CreateUser = async (userName, encryptedPwd, userType) => {
    return User.create({
        userName: userName,
        password: encryptedPwd,
        userType: userType,
        isActive: true
    })
}

const GetUserByUserName = async (userName) => {
    return User.findOne({
        where: {
            userName: userName,
            isActive: true
        }
    })
}

const createSeller = async (userId, sellerName) => {
    return await Seller.create({
        name: sellerName,
        userId: userId,
        isActive: true
    })
}

const CreateSellerUser = async (userName, encryptedPwd, sellerName) => {
    try {
        const user = await CreateUser(userName, encryptedPwd, UserType.Seller)
        const seller = await createSeller(user.id, sellerName)
        return { user, seller }

    } catch (error) {
        throw error
    }
}

module.exports = {
    CreateUser,
    CreateSellerUser,
    GetUserByUserName
}