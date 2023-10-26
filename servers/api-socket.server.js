import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'

// imports for sockets
import shutDown from '../pubsub/shutdown.listener.js'
import httpListener from '../pubsub/http.listener.js'
import listenerCreate from '../pubsub/create.listener.js'
import listenerDelete from '../pubsub/delete.listener.js'
import upgradeListener from '../pubsub/upgrade.listener.js'
import messageListener from '../pubsub/message.listener.js'
import socketSubscriber from '../pubsub/socket.subscriber.js'

// imports for api
import injectAllRoutes from '../routes/index.route.js'
import createRedis from '../factories/redis.factory.js'
import { dbConnection } from '../middlewares/database.middleware.js'
import { requestLogger, errorHandler } from '../middlewares/basic.middleware.js'

const PORT = process.env.API_SOCKET_PORT
const app = express()
const server = createServer(app)
const shutDownSignals = ['SIGTERM', 'SIGINT']
const redisMapListener = {
	create: listenerCreate,
	delete: listenerDelete,
}
const channels = Object.keys(redisMapListener)
const [redis, subscriber] = [createRedis(), createRedis()]

// Enable CORS
app.use(cors())

// log all requests middleware
app.use(requestLogger({ level: 'INFO' }))

// database middleware
app.use(dbConnection)

// Inject routes to this app
await injectAllRoutes(app)

// error handling middleware
app.use(errorHandler)

// create websocket servers from code saved in redis
const _ = (await redis.keys('*')).map(path => listenerCreate(path))

subscriber.subscribe(channels, socketSubscriber)
subscriber.on('message', messageListener)
server.on('upgrade', upgradeListener)
server.listen(PORT, httpListener('API&Sockets', PORT))
shutDownSignals.forEach(signal => process.on(
	signal,
	shutDown('API&Sockets', signal, server, [redis, subscriber])),
)

// all exported members are used in other files
export { redis, redisMapListener, channels }
