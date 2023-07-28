const { User } = require('./user')
const { sequelize, DataTypes } = require('../config/database')

const Seller = sequelize.define(
    'seller',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            length: 50,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        freezeTableName: true,
        underscored: true,
        indexes: [
            {
                unique: true,     //overrides index by foreign key and create unique index
                fields: ['user_id']
            }
        ],
        
    }
)

Seller.belongsTo(User)
User.hasOne(Seller)

module.exports = {
    Seller
}