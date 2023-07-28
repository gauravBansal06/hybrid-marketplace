const UserType = {
    Buyer: 'buyer',
    Seller: 'seller'
}
const ValidNewRegistrationUserTypes = [UserType.Buyer, UserType.Seller]

const ValidNameLengths = {
    MaxUserNameLen: 10,
    MinPasswordLen: 5,
    Default: 50
}

module.exports = {
    UserType,
    ValidNewRegistrationUserTypes,
    ValidNameLengths
}