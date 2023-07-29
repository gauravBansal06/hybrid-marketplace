const { Sequelize, DataTypes}  = require('sequelize')
const { MySqlDB } = require('.')

const sequelize = new Sequelize(
    MySqlDB.Name, MySqlDB.User, MySqlDB.Password,
    {
        host: MySqlDB.Host,
        dialect: 'mysql',
        logging: MySqlDB.EnableLogging,
        logQueryParameters: MySqlDB.EnableLogging
    }
)

function InitDatabase(){
    return new Promise((resolve, reject) => {
        sequelize.authenticate().then(() => {
            console.log('Successfully Connected to MySQL DB');
            resolve('success')
        }).catch((error) => {
            console.log('Error connecting to MySQL DB - ', JSON.stringify(error))
            reject('failed')
        })
    })
}

function StopDatabase(){
    return new Promise((resolve, reject) => {
        sequelize.close().then(() => {
            console.log('Successfully closed connection to MySQL DB');
            resolve('success')
        }).catch((error) => {
            console.log('Error closing connection to MySQL DB - ', JSON.stringify(error))
            reject('failed')
        })
    })
}

module.exports = {
    sequelize,
    DataTypes,
    InitDatabase,
    StopDatabase
}
