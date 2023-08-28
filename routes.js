import { WebSocketServer } from 'ws'
import express from 'express'

const PORT = process.env.PORT || 5000
const socketsMap = new Map()

const createWebSocketServer = (req, res, next) => {
    try {
        console.log(req.body.code)
        const url = `/${req.body.username}/${req.body.project}`
        const uri = `ws://${process.env.NODE_ENV === 'production' ? 'api.mirna.cloud' : 'localhost:' + PORT}${url}`

        // dynamic code execution from user input start running here
        const webSocketServer = new WebSocketServer({ noServer: true })
        const codeRunner = new Function('wss', req.body.code)
        codeRunner(webSocketServer)
        // dynamic code execution from user input ends here

        socketsMap.set(url, webSocketServer)
        res.status(201).json({
            message: 'WebSocketServer created successfully',
            uri,
        })
    } catch (err) {
        next(err)
    }
}

const deleteWebSocketServer = (req, res) => {
    try {
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}

const healthCheck = (req, res) => {
    try {
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}

export { socketsMap }

export default function injectRoutes(app) {
    app.get('/health', express.json(), healthCheck)
    app.post('/socket', express.json(), createWebSocketServer)
    app.delete('/socket', express.json(), deleteWebSocketServer)
}
