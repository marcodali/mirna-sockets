import { WebSocketServer } from 'ws'
import express from 'express'

const PORT = process.env.PORT || 5000
const socketsMap = new Map()

const createWebSocketServer = (req, res, next) => {
    try {
        console.log(req.body.code)
        const path = `/${req.body.username}/${req.body.project}`
        let protocol, host, port
        if (process.env.NODE_ENV === 'production') {
            protocol = 'wss'
            host = 'api.mirna.cloud'
            port = ''
        } else {
            protocol = 'ws'
            host = 'localhost'
            port = ':' + PORT
        }

        // dynamic code execution from user input start running here
        const webSocketServer = new WebSocketServer({ noServer: true })
        const codeRunner = new Function('wss', req.body.code)
        codeRunner(webSocketServer)
        // dynamic code execution from user input ends here

        socketsMap.set(path, webSocketServer)
        res.status(201).json({
            message: 'WebSocketServer created successfully',
            uri: `${protocol}://${host}${port}${path}`,
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
