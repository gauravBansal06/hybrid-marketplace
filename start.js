const dotenv = require('dotenv')
dotenv.config()

const { InitDatabase, StopDatabase } = require('./config/database')
const { MigrateDatabaseTables } = require('./models')
const { StartServer, StopServer } = require('./server')

function startApplication(){
    StartServer()
}

function handleShutDown(){
    StopDatabase().then(() => {
        StopServer()
    }).catch((error) => {
        console.log(error)
    })
}

try {
    InitDatabase().then(() => {
        MigrateDatabaseTables().then(() => {
            startApplication()
        })
    })
} catch (error) {
    handleShutDown()
    console.log(error)
}

process.on('SIGINT', handleShutDown)
process.on('SIGTERM', handleShutDown)