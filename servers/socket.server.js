import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { createServer } from 'http'

import httpListener from '../pubsub/http.listener.js'
import createRedis from '../factories/redis.factory.js'
import listenerCreate from '../pubsub/create.listener.js'
import listenerDelete from '../pubsub/delete.listener.js'
import shutDown from '../pubsub/shutdown.listener.js'
import upgradeListener from '../pubsub/upgrade.listener.js'
import messageListener from '../pubsub/message.listener.js'
import socketSubscriber from '../pubsub/socket.subscriber.js'
import { injectHealthRoutes } from '../routes/index.route.js'
import { requestLogger, errorHandler } from '../middlewares/basic.middleware.js'

const shutDownSignals = ['SIGTERM', 'SIGINT']
const app = express()

// Enable CORS
app.use(cors())

// log all requests middleware
app.use(requestLogger({ level: 'INFO' }))

// Inject routes to this app
await injectHealthRoutes(app)

// error handling middleware
app.use(errorHandler)

const server = createServer(app)
const subscriber = createRedis()
export const PORT = process.env.SOCKET_PORT
export const redis = createRedis()
export const redisMapListener = {
  create: listenerCreate,
  delete: listenerDelete,
}
export const channels = Object.keys(redisMapListener)

// create websocket servers from code saved in redis
const _ = (await redis.keys('*')).map(path => listenerCreate(path))

subscriber.subscribe(channels, socketSubscriber)
subscriber.on('message', messageListener)
server.on('upgrade', upgradeListener)
server.listen(PORT, httpListener('Socket', PORT))
shutDownSignals.forEach(signal => process.on(
  signal,
  shutDown('Socket', signal, server, [redis, subscriber])),
)
