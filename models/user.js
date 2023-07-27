const { sequelize, DataTypes } = require('../config/database')
const { UserType } = require('../constants/user')

const User = sequelize.define(
    'user',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        userName: {
            type: DataTypes.STRING,
            length: 20,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userType: {
            type: DataTypes.ENUM,
            values: [UserType.Buyer, UserType.Seller],
            defaultValue: UserType.Buyer,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        iaActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        freezeTableName: true,
        underscored: true
    }
)

module.exports = {
    User
}