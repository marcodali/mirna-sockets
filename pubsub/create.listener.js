import { WebSocketServer } from 'ws'

import { redis } from '../servers/socket.server.js'
import { socketProvider } from '../providers/socket.provider.js'

// Listening pub/sub redis events
export default async function listenerCreate(path) {
    try {
        const code = await redis.get(path)
        const codeRunner = new Function('wss', code)
        const webSocketServer = new WebSocketServer({ noServer: true })

        // dynamic code execution from user input starts here
        codeRunner(webSocketServer)
        // dynamic code execution from user input ends here

        if (socketProvider.getOneSocket(path)) {
            throw new Error('Socket already exists')
        }
        socketProvider.createSocket(path, codeRunner, webSocketServer)
    } catch (error) {
        console.error('At dynamic code execution something went wrong', error)
    }
}
