const express = require('express')
const { Server } = require('../config')

let httpServer
const app = express()

app.use(express.json())

function StartServer() {
    return new Promise(resolve => {
        httpServer = app.listen(Server.Port, () => {
          const { port } = httpServer.address()
          console.log(`🤘 Successfully Started Server: http://localhost:${port}`)
        })
        resolve(httpServer)
    })
}

function StopServer() {
    httpServer.close( () => {
        console.log(`Closed http server successfully`)
    })
}

module.exports = {
    app,
    StartServer,
    StopServer
}