const express = require('express')
const { Server } = require('../config')
const router = require('../api')
const { LoggerMiddleware } = require('../middleware')

let httpServer
const app = express()

app.use(express.json())
app.use(LoggerMiddleware)
app.use(`/api/${Server.Version}`, router) //making every route - "http://localhost:port/api/v1/{route}"

function StartServer() {
    try {
        httpServer = app.listen(Server.Port, () => {
            const { port } = httpServer.address()
            console.log(`Successfully Started Server: http://localhost:${port}`)
        })
    } catch (error) {
        console.log(`Error in starting server - ${error}`)
    }
}

function StopServer() {
    try {
        httpServer.close(() => {
            console.log(`Closed http server successfully`)
        })
    } catch (error) {
        console.log(`Error in shutting down server - ${error}`)
    }
}

module.exports = {
    app,
    StartServer,
    StopServer
}