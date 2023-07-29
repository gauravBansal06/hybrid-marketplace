const dotenv = require('dotenv')
dotenv.config()

const { InitDatabase, StopDatabase } = require('./config/database')
const { MigrateDatabaseTables } = require('./models')
const { StartServer, StopServer } = require('./server')

function handleShutDown() {
    StopDatabase().then(() => {
        StopServer()
    }).catch((error) => {
        console.log(error)
    })
}

InitDatabase().then(() => {
    MigrateDatabaseTables().then(() => { //This function created tables in DB
        StartServer()
    }).catch((error) => {
        console.log(error)
        handleShutDown()
    })
}).catch((error) => {
    console.log(error)
})

process.on('SIGINT', handleShutDown)
process.on('SIGTERM', handleShutDown)