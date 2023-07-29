const { sequelize } = require('../config/database')
const { UserType } = require('../constants/user')
const { User, Seller, Catalog } = require('../models')

//user methods
const CreateUser = async (userName, encryptedPwd, userType, transaction = null) => {
    return User.create({
        userName: userName,
        password: encryptedPwd,
        userType: userType,
        isActive: true
    }, { transaction })
}

const GetUserById = async (userId) => {
    return User.findOne({
        where: {
            id: userId,
            isActive: true
        }
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

//seller methods
const createSeller = async (userId, sellerName, transaction = null) => {
    return Seller.create({
        name: sellerName,
        userId: userId,
        isActive: true
    }, { transaction })
}

const CreateSellerUser = async (userName, encryptedPwd, sellerName) => {
    const transaction = await sequelize.transaction()
    try {
        const user = await CreateUser(userName, encryptedPwd, UserType.Seller, transaction)
        const seller = await createSeller(user.id, sellerName, transaction)
        await transaction.commit()
        return { user, seller }
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

const GetSellerByUserId = async (userId) => {
    return Seller.findOne({
        where: {
            userId: userId,
            isActive: true
        }
    })
}

const GetSellerById = async (sellerId) => {
    return Seller.findOne({
        where: {
            id: sellerId,
            isActive: true
        },
        include: [
            {
                model: User,
                where: {
                    isActive: true
                }
            }
        ]
    })
}

const GetAllSellers = async () => {
    return Seller.findAll({
        where: {
            isActive: true
        },
        include: [
            {
                model: User,
                where: {
                    isActive: true
                }
            },
            {
                model: Catalog
            }
        ],
        order: [['created_at', 'DESC']]
    })
}

module.exports = {
    CreateUser,
    GetUserById,
    GetUserByUserName,
    
    CreateSellerUser,
    GetSellerByUserId,
    GetSellerById,
    GetAllSellers
}