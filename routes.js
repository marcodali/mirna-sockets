import { WebSocketServer } from 'ws'
import express from 'express'

const socketsMap = new Map()

const createWebSocketServer = (req, res) => {
    console.log(req.body.code)
    const url = `/ws/${req.body.username}/${req.body.project}`

    // dynamic code execution from user input start running here
    const webSocketServer = new WebSocketServer({ noServer: true })
    const codeRunner = new Function('wss', req.body.code)
    codeRunner(webSocketServer)
    // dynamic code execution from user input ends here
    
    socketsMap.set(url, webSocketServer)
    res.status(201).json({
        message: 'new WebSocketServer created successfully',
        uri: `ws://localhost:3000${url}`
    })
}

const deleteWebSocketServer = (req, res) => {
    res.status(204).send()
}

export { socketsMap }

export default function injectRoutes(app) {
    app.post('/socket', express.json(), createWebSocketServer)
    app.delete('/socket', express.json(), deleteWebSocketServer)
}
